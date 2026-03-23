# Market Bidding Test Reference

## Quick Reference: Market Hours & Scenarios

### Active Markets
```
┌─────────────────────┬──────────┬──────────────────────────┐
│ Market Name         │ ID       │ Bidding Window (IST)     │
├─────────────────────┼──────────┼──────────────────────────┤
│ Morning Market      │ 1        │ 09:00 - 11:00           │
│ Evening Market      │ 2        │ 16:00 - 18:00           │
│ Test Market - 02:46 │ 3        │ 02:46 - 11:59           │
└─────────────────────┴──────────┴──────────────────────────┘
```

## Test Scenarios & Expected Results

### Morning Market (09:00 - 11:00)

| Time | Status | Reason | HTTP | Response |
|------|--------|--------|------|----------|
| **08:50** | ❌ FAIL | Before open time | 400 | `Market not yet open for bidding` |
| **09:00** | ✅ SUCCESS | Exactly at open | 201 | Bid placed |
| **09:30** | ✅ SUCCESS | Within window | 201 | Bid placed |
| **10:59** | ✅ SUCCESS | Just before close | 201 | Bid placed |
| **11:00** | ❌ FAIL | At close time (≥) | 400 | `Bidding closed for this market` |
| **11:15** | ❌ FAIL | After close time | 400 | `Bidding closed for this market` |

### Evening Market (16:00 - 18:00)

| Time | Status | Reason | HTTP | Response |
|------|--------|--------|------|----------|
| **15:45** | ❌ FAIL | Before open time | 400 | `Market not yet open for bidding` |
| **16:00** | ✅ SUCCESS | Exactly at open | 201 | Bid placed |
| **16:30** | ✅ SUCCESS | Within window | 201 | Bid placed |
| **17:59** | ✅ SUCCESS | Just before close | 201 | Bid placed |
| **18:00** | ❌ FAIL | At close time (≥) | 400 | `Bidding closed for this market` |
| **18:30** | ❌ FAIL | After close time | 400 | `Bidding closed for this market` |

### Test Market (02:46 - 11:59)

| Time | Status | Reason | HTTP | Response |
|------|--------|--------|------|----------|
| **02:45** | ❌ FAIL | Before open | 400 | `Market not yet open for bidding` |
| **02:46** | ✅ SUCCESS | At open | 201 | Bid placed |
| **06:00** | ✅ SUCCESS | Within window | 201 | Bid placed |
| **11:58** | ✅ SUCCESS | Just before close | 201 | Bid placed |
| **11:59** | ❌ FAIL | At close time (≥) | 400 | `Bidding closed for this market` |

---

## Bid Payload Reference

### Base Request Structure
```http
POST /api/user/bids
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "marketId": <number>,
  "gameType": <string>,
  "number": <string>,
  "amount": <number>
}
```

### Game Types & Number Formats

#### Single Digit
```json
{
  "marketId": 1,
  "gameType": "single_digit",
  "number": "5",
  "amount": 100
}
```
- **Number Format**: 1 digit (0-9)
- **Description**: Single digit bet
- **Example**: "0", "5", "9"

#### Jodi
```json
{
  "marketId": 1,
  "gameType": "jodi",
  "number": "45",
  "amount": 200
}
```
- **Number Format**: 2 digits (00-99)
- **Description**: Two digit combination
- **Example**: "00", "45", "99"

#### Single Panna
```json
{
  "marketId": 1,
  "gameType": "single_panna",
  "number": "123",
  "amount": 500
}
```
- **Number Format**: 3 digits (000-999)
- **Description**: Three digit combination
- **Example**: "000", "123", "999"

#### Double Panna
```json
{
  "marketId": 1,
  "gameType": "double_panna",
  "number": "456",
  "amount": 500
}
```
- **Number Format**: 3 digits (000-999)

#### Triple Panna
```json
{
  "marketId": 1,
  "gameType": "triple_panna",
  "number": "789",
  "amount": 500
}
```
- **Number Format**: 3 digits (000-999)

#### Half Sangam
```json
{
  "marketId": 1,
  "gameType": "half_sangam",
  "number": "123",
  "amount": 750
}
```
- **Number Format**: 3 digits
- **Description**: Half combination

#### Full Sangam
```json
{
  "marketId": 1,
  "gameType": "full_sangam",
  "number": "123456",
  "amount": 1000
}
```
- **Number Format**: 6 digits (3+3 format)
- **Description**: Full combination
- **Example**: "123456", "000999"

### Field Constraints
| Field | Type | Min | Max | Notes |
|-------|------|-----|-----|-------|
| marketId | integer | 1 | ∞ | Must exist & be active |
| gameType | enum | - | - | Must be from list above |
| number | string | 1 char | 6 chars | Must match gameType format |
| amount | number | 1 | 10000 | Rupees, must have balance |

---

## Error Scenarios & Responses

### 400 Bad Request - Market Timing
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Market not yet open for bidding"
}
```
- **When**: Current time < market openTime
- **Action**: Wait until market opens

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Bidding closed for this market"
}
```
- **When**: Current time ≥ market closeTime
- **Action**: Wait for next market opening or different market

### 400 Bad Request - Insufficient Balance
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Insufficient balance"
}
```
- **When**: Wallet balance < bid amount
- **Action**: Deposit funds before placing bid

### 400 Bad Request - Invalid Bid Number
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid bid number for selected game type"
}
```
- **When**: Number doesn't match gameType format
- **Example**: `gameType: "single_digit"` with `number: "45"` (2 digits instead of 1)
- **Action**: Check number format matches game type

### 409 Conflict - Duplicate Bid
```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": "Duplicate bid not allowed"
}
```
- **When**: Same user has bid for same market + gameType + number
- **Key**: marketId + gameType + number must be unique per user
- **Action**: Use different number or wait for market to close

### 403 Forbidden - User Blocked
```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "User not found or blocked"
}
```
- **When**: User account is blocked or doesn't exist
- **Action**: Contact support

### 404 Not Found - Market Inactive
```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "Market not found or inactive"
}
```
- **When**: marketId doesn't exist or market is inactive
- **Action**: Check available markets via GET /api/user/markets

---

## CURL Testing Commands

### Setup Variables
```bash
# Set these before running commands
API_BASE="http://localhost:3000/api"
AUTH_TOKEN="your_jwt_token_here"
MARKET_ID=1
```

### Test 1: Bid During Market Hours (SUCCESS)
```bash
curl -X POST "$API_BASE/user/bids" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "marketId": '$MARKET_ID',
    "gameType": "jodi",
    "number": "45",
    "amount": 100
  }'
```

**Expected**: 201 Created with bid details

### Test 2: Bid Before Market Opens (FAIL)
```bash
# Run this before market opens
curl -X POST "$API_BASE/user/bids" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "marketId": '$MARKET_ID',
    "gameType": "jodi",
    "number": "45",
    "amount": 100
  }'
```

**Expected**: 400 Bad Request with message "Market not yet open for bidding"

### Test 3: Bid After Market Closes (FAIL)
```bash
# Run this after market closes
curl -X POST "$API_BASE/user/bids" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "marketId": '$MARKET_ID',
    "gameType": "jodi",
    "number": "45",
    "amount": 100
  }'
```

**Expected**: 400 Bad Request with message "Bidding closed for this market"

### Test 4: Invalid Number Format (FAIL)
```bash
# single_digit requires 1 digit, but we're sending 2
curl -X POST "$API_BASE/user/bids" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "marketId": '$MARKET_ID',
    "gameType": "single_digit",
    "number": "45",
    "amount": 100
  }'
```

**Expected**: 400 Bad Request with message "Invalid bid number for selected game type"

### Test 5: Duplicate Bid (FAIL)
```bash
# Run this twice to test duplicate prevention
curl -X POST "$API_BASE/user/bids" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "marketId": '$MARKET_ID',
    "gameType": "jodi",
    "number": "45",
    "amount": 100
  }'
```

**First call**: 201 Created
**Second call**: 409 Conflict with message "Duplicate bid not allowed"

### Test 6: View All Bids
```bash
curl -X GET "$API_BASE/user/bids" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Expected**: 200 OK with array of user's bids

### Test 7: Get Markets
```bash
curl -X GET "$API_BASE/user/markets" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Expected**: 200 OK with market list including IDs, names, and times

---

## JavaScript/Node.js Testing

### Using Fetch API
```javascript
const API_BASE = "http://localhost:3000/api";
const AUTH_TOKEN = "your_jwt_token";

async function placeBid(marketId, gameType, number, amount) {
  try {
    const response = await fetch(`${API_BASE}/user/bids`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        marketId,
        gameType,
        number: String(number),
        amount
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Bid placed:", data);
    } else {
      console.error("❌ Error:", data.error);
    }

    return { status: response.status, data };
  } catch (error) {
    console.error("Request failed:", error);
  }
}

// Test scenarios
async function runTests() {
  // Test 1: Single digit bet
  console.log("Test 1: Single digit");
  await placeBid(1, "single_digit", "5", 50);

  // Test 2: Jodi bet
  console.log("\nTest 2: Jodi");
  await placeBid(1, "jodi", "45", 100);

  // Test 3: Full sangam
  console.log("\nTest 3: Full Sangam");
  await placeBid(1, "full_sangam", "123456", 500);

  // Test 4: Invalid format
  console.log("\nTest 4: Invalid (should fail)");
  await placeBid(1, "single_digit", "45", 100);
}

runTests();
```

### Using Axios
```javascript
const axios = require("axios");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Authorization": `Bearer your_jwt_token`
  }
});

async function testBidding() {
  try {
    // Get markets
    const markets = await api.get("/user/markets");
    console.log("Markets:", markets.data);

    // Place bid
    const bid = await api.post("/user/bids", {
      marketId: 1,
      gameType: "jodi",
      number: "45",
      amount: 100
    });
    console.log("Bid placed:", bid.data);

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

testBidding();
```

---

## Time-Based Testing Strategy

### Manual Testing at Specific Times
```bash
# For Morning Market (09:00-11:00, test at specific minutes)

# 1. Test before open (08:50)
sleep 180 && curl http://localhost:3000/api/user/bids ...  # 3 min wait = 08:50

# 2. Test at open (09:00)
sleep 600 && curl http://localhost:3000/api/user/bids ...  # 10 min wait = 09:00

# 3. Test during window (09:30)
sleep 1200 && curl http://localhost:3000/api/user/bids ... # 20 min wait = 09:30

# 4. Test at close (11:00)
sleep 3600 && curl http://localhost:3000/api/user/bids ... # 60 min wait = 11:00
```

### Automated Testing with Scheduling
```javascript
// Node.js with node-cron
const cron = require("node-cron");
const axios = require("axios");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Authorization": `Bearer token` }
});

// Run test at specific times
cron.schedule("50 8 * * *", async () => {
  console.log("Testing before market open (08:50)");
  try {
    await api.post("/user/bids", {
      marketId: 1,
      gameType: "jodi",
      number: "45",
      amount: 100
    });
  } catch (error) {
    console.log("Expected error:", error.response?.data?.error);
  }
});

cron.schedule("30 9 * * *", async () => {
  console.log("Testing during market (09:30)");
  // Same bid attempt
});

cron.schedule("15 11 * * *", async () => {
  console.log("Testing after market close (11:15)");
  // Same bid attempt
});
```

---

## Important Notes

### Time Zone
- ⚠️ All times are in **IST (Indian Standard Time / UTC+5:30)**
- Server converts system time to IST automatically
- Ensure your test machine has correct time set

### Bidding Window Logic
```
Current Time Validation:
├─ if (currentTime < openTime)
│  └─ Error: "Market not yet open for bidding"
├─ if (openTime ≤ currentTime < closeTime)
│  └─ ✅ Accept bid
└─ if (currentTime ≥ closeTime)
   └─ Error: "Bidding closed for this market"

Note: Bid at closeTime is REJECTED (uses ≥ comparison)
```

### Testing Best Practices
1. **Always use a test user** with sufficient balance (₹10,000+)
2. **Test near boundaries** (08:59, 09:00, 09:01, 10:59, 11:00, 11:01)
3. **Test all game types** to understand number format requirements
4. **Test error scenarios** to understand all response types
5. **Log timestamps** with every test for audit trail
6. **Test duplicate prevention** to ensure DB constraints work

### Database Queries for Testing
```sql
-- Check all markets
SELECT id, name, openTime, closeTime, isActive FROM markets;

-- Check user's bids
SELECT * FROM bids WHERE user_id = 1 ORDER BY created_at DESC;

-- Check bid count by status
SELECT status, COUNT(*) FROM bids GROUP BY status;

-- Check for duplicate bids (should be none)
SELECT market_id, game_type, number, user_id, COUNT(*)
FROM bids
GROUP BY market_id, game_type, number, user_id
HAVING COUNT(*) > 1;
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Market not found" | Invalid marketId | Use correct ID from GET /user/markets |
| "Insufficient balance" | Insufficient funds | Deposit money or use lower amount |
| "Duplicate bid not allowed" | Already have this bet | Use different number or game type |
| "Invalid bid number" | Wrong format for gameType | Check number length vs game type |
| Error 403 "User blocked" | Account suspended | Contact admin |
| Error 500 | Server error | Check server logs, restart if needed |
| Works on 09:01 but not 09:00 | Timing issue | Server might not have updated time yet |

---

## Running the Full Test Script

From the repository root:
```bash
# Using tsx (TypeScript executor)
cd scripts
npx tsx src/test-market-bidding.ts

# Or using ts-node
ts-node src/test-market-bidding.ts

# Or compile and run
pnpm build
node dist/src/test-market-bidding.js
```

This will display:
1. All active markets with bidding windows
2. Test scenarios with expected outcomes
3. Bid payload examples for each game type
4. Complete API testing guide with curl/fetch examples
5. Step-by-step testing instructions
