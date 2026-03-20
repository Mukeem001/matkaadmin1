# Bid, Wallet & Win/Loss System Documentation

## 🎯 System Overview

The system handles the complete betting lifecycle:
1. **User places bid** → Wallet deducted
2. **Market game happens** → Results declared
3. **Results matched** → Win/Loss status determined
4. **Wallet updated** → Winnings credited

---

## 📡 APIs Used

### 1. **Place Bid API**
**Endpoint:** `POST /user/bids`
**Authentication:** User Token Required

**Request Body:**
```json
{
  "marketId": 1,
  "gameType": "single_digit",
  "amount": 100,
  "number": "5"
}
```

**Game Types:**
- `single_digit` - 1 digit (0-9)
- `jodi` - 2 digits (00-99)
- `single_panna` - 3 digits (000-999)
- `double_panna` - 3 digits with exactly 2 unique digits
- `triple_panna` - 3 digits with exactly 3 unique digits
- `half_sangam` - 3 digits (matches either open or close)
- `full_sangam` - 6 digits (3+3, matches open+close)

**What Happens:**
1. Checks if market is active and open
2. Validates user balance
3. **Deducts amount from wallet** (in transaction)
4. Creates bid with status `pending`

**Response (201):**
```json
{
  "bid": {
    "id": 1,
    "marketId": 1,
    "gameType": "single_digit",
    "amount": 100,
    "number": "5",
    "status": "pending",
    "createdAt": "2024-03-18T10:30:00Z"
  }
}
```

**File:** [artifacts/api-server/src/routes/user.ts](artifacts/api-server/src/routes/user.ts#L107-L180)

---

### 2. **Get Market Results API**
**Endpoint:** `POST /results`
**Authentication:** Admin Token Required

**Request Body:**
```json
{
  "marketId": 1,
  "resultDate": "2024-03-18",
  "openResult": "123",
  "closeResult": "456",
  "jodiResult": "79",
  "pannaResult": "147"
}
```

**What Happens:**
1. Saves result to database
2. Updates market's openResult, closeResult, jodiResult
3. **Triggers automatic bid processing** via `processMarketBids()`
4. Matches all pending bids against results

**File:** [artifacts/api-server/src/routes/results.ts](artifacts/api-server/src/routes/results.ts#L34-L77)

---

## 🏆 Win/Loss Calculation Engine

**File:** [artifacts/api-server/src/lib/bid-processor.ts](artifacts/api-server/src/lib/bid-processor.ts)

### How Results Are Matched:

#### **Single Digit** (gameType: `single_digit`)
```
Logic: Last digit of (open + close)
Example:
  Open = 123 → last digit = 3
  Close = 456 → last digit = 6
  Sum = 3 + 6 = 9 → Last digit = 9
  Bid 9 = WIN ✓
```

#### **Jodi** (gameType: `jodi`)
```
Logic: Exact sum of last digits (open + close), padded to 2 digits
Example:
  Open = 123 → last digit = 3
  Close = 456 → last digit = 6
  Sum = 3 + 6 = 9 → Padded = "09"
  Bid 09 = WIN ✓
```

#### **Single Panna** (gameType: `single_panna`)
```
Logic: Exact match with open result
Example:
  Open = 123
  Bid 123 = WIN ✓
```

#### **Double Panna** (gameType: `double_panna`)
```
Logic: Open result with exactly 2 unique digits
Example:
  Open = 112 (digits: 1,1,2 → 2 unique → valid double panna)
  Bid 112 = WIN ✓
  
  Open = 123 (digits: 1,2,3 → 3 unique → NOT double panna)
  Bid 123 = LOSE ✗
```

#### **Triple Panna** (gameType: `triple_panna`)
```
Logic: Open result with all 3 unique digits
Example:
  Open = 123 (digits: 1,2,3 → 3 unique → valid triple panna)
  Bid 123 = WIN ✓
  
  Open = 112 (digits: 1,1,2 → 2 unique → NOT triple panna)
  Bid 112 = LOSE ✗
```

#### **Half Sangam** (gameType: `half_sangam`)
```
Logic: Matches either open OR close result
Example:
  Open = 123, Close = 456
  Bid 123 = WIN ✓ (matches open)
  Bid 456 = WIN ✓ (matches close)
  Bid 789 = LOSE ✗
```

#### **Full Sangam** (gameType: `full_sangam`)
```
Logic: Matches both open AND close combined (6 digits)
Example:
  Open = 123, Close = 456
  Combined = 123456
  Bid 123456 = WIN ✓
  Bid 123789 = LOSE ✗
```

---

## 💰 Winnings Calculation

**Formula:** `Winnings = Bid Amount × Game Rate`

**Game Rates (from database):**
```
singleDigit: 9x (90x return means 9x profit)
jodiDigit: 90x
singlePanna: 9x
doublePanna: 180x
triplePanna: 270x
halfSangam: 180x
fullSangam: 9000x
```

**Example:**
```
Bid: 100 rupees on Single Digit (9x rate)
Winnings = 100 × 9 = 900 rupees
Total paid back = 100 (original) + 900 (winnings) = 1000 rupees
```

---

## 🔄 Bid Processing Flow (Automatic)

When result is declared, this happens automatically:

```
1. Result Declared
   ↓
2. Get all PENDING bids for market
   ↓
3. For each bid:
   ├─ Check if bid number matches result
   │  ├─ IF WIN:
   │  │  ├─ Calculate winnings
   │  │  ├─ Update bid status → "won"
   │  │  └─ Add (original amount + winnings) to wallet
   │  │
   │  └─ IF LOSE:
   │     └─ Update bid status → "lost"
   │        (amount already deducted)
   ↓
4. Complete
```

**Code:** [artifacts/api-server/src/lib/bid-processor.ts](artifacts/api-server/src/lib/bid-processor.ts#L111-L190)

---

## 📊 Database Tables

### **bids Table**
```sql
CREATE TABLE bids (
  id: primary key
  userId: foreign key → users
  marketId: foreign key → markets
  gameType: enum (single_digit, jodi, single_panna, etc.)
  amount: decimal
  number: string
  status: enum (pending, won, lost)
  createdAt: timestamp
)
```

### **users Table**
```sql
walletBalance: decimal (updated on bid + on win)
```

### **results Table**
```sql
CREATE TABLE results (
  id: primary key
  marketId: foreign key → markets
  resultDate: date
  openResult: string (e.g., "123")
  closeResult: string (e.g., "456")
  jodiResult: string (e.g., "79")
  pannaResult: string
  declaredAt: timestamp
)
```

---

## 🔐 Key Features

✅ **Atomic Transactions** - Both wallet deduction and bid creation happen together or not at all
✅ **Duplicate Prevention** - User can't place same bet twice (same market, game type, number)
✅ **Validation** - Checks market status, user balance, bidding time window
✅ **Automatic Processing** - No manual action needed for win/loss calculation
✅ **Detailed Logging** - All operations logged for debugging

---

## 📱 User Bid History API

**Endpoint:** `GET /user/bids?page=1&limit=20`
**Authentication:** User Token Required

**Response:**
```json
{
  "bids": [
    {
      "id": 1,
      "marketId": 1,
      "marketName": "KALYAN",
      "gameType": "single_digit",
      "amount": 100,
      "number": "5",
      "status": "won",
      "createdAt": "2024-03-18T10:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

---

## 🛠️ Implementation Status

✅ Bid placement with wallet deduction
✅ Result matching with all game types
✅ Win/loss status updates
✅ Automatic winnings calculation
✅ Wallet balance updates
✅ Bid history tracking
✅ Error handling and validation
✅ Transaction safety

**System is production-ready!**
