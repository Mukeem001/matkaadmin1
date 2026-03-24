import { db, marketsTable, usersTable } from "@workspace/db";

/**
 * Test script: Market Bidding Scenarios
 * 
 * This demonstrates how bidding works with market open/close times
 * and tests various scenarios with curl/fetch examples.
 */

interface TestScenario {
  name: string;
  marketName: string;
  testTime: string; // HH:MM in IST
  testTimeDate: Date;
  shouldSucceed: boolean;
  reason: string;
  estimatedStatus: number;
  estimatedMessage: string;
}

// ============================================================================
// STEP 1: Display Active Markets
// ============================================================================

async function displayActiveMarkets() {
  console.log("\n" + "=".repeat(80));
  console.log("STEP 1: ACTIVE MARKETS WITH BIDDING WINDOWS");
  console.log("=".repeat(80));

  const markets = await db.select().from(marketsTable).where();

  markets.forEach((market) => {
    console.log(`\n📅 ${market.name}`);
    console.log(`   ID: ${market.id}`);
    console.log(`   Bidding Window: ${market.openTime} - ${market.closeTime} IST`);
    console.log(`   Status: ${market.isActive ? "🟢 ACTIVE" : "🔴 INACTIVE"}`);
  });

  return markets;
}

// ============================================================================
// STEP 2: Calculate Time Windows
// ============================================================================

function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatMinutesAsTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function createTestDate(timeStr: string): Date {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const [hours, minutes] = timeStr.split(":").map(Number);

  istTime.setHours(hours, minutes, 0, 0);
  return istTime;
}

// ============================================================================
// STEP 3: Define and Run Test Scenarios
// ============================================================================

async function runTestScenarios(markets: typeof marketsTable.$inferSelect[]) {
  console.log("\n" + "=".repeat(80));
  console.log("STEP 2: TEST SCENARIOS");
  console.log("=".repeat(80));

  // Define test scenarios
  const scenarios: TestScenario[] = [
    // Morning Market Tests
    {
      name: "Morning Market - Before Opening (08:50)",
      marketName: "Morning Market",
      testTime: "08:50",
      testTimeDate: createTestDate("08:50"),
      shouldSucceed: false,
      reason: "Current time (08:50) is before open time (09:00)",
      estimatedStatus: 400,
      estimatedMessage: "Market not yet open for bidding",
    },
    {
      name: "Morning Market - During Bidding Window (09:30)",
      marketName: "Morning Market",
      testTime: "09:30",
      testTimeDate: createTestDate("09:30"),
      shouldSucceed: true,
      reason: "Current time (09:30) is within open (09:00) and close (11:00) window",
      estimatedStatus: 201,
      estimatedMessage: "Bid placed successfully",
    },
    {
      name: "Morning Market - After Closing (11:15)",
      marketName: "Morning Market",
      testTime: "11:15",
      testTimeDate: createTestDate("11:15"),
      shouldSucceed: false,
      reason: "Current time (11:15) is at or after close time (11:00)",
      estimatedStatus: 400,
      estimatedMessage: "Bidding closed for this market",
    },

    // Evening Market Tests
    {
      name: "Evening Market - During Bidding Window (16:30)",
      marketName: "Evening Market",
      testTime: "16:30",
      testTimeDate: createTestDate("16:30"),
      shouldSucceed: true,
      reason: "Current time (16:30) is within open (16:00) and close (18:00) window",
      estimatedStatus: 201,
      estimatedMessage: "Bid placed successfully",
    },
    {
      name: "Evening Market - After Closing (18:30)",
      marketName: "Evening Market",
      testTime: "18:30",
      testTimeDate: createTestDate("18:30"),
      shouldSucceed: false,
      reason: "Current time (18:30) is after close time (18:00)",
      estimatedStatus: 400,
      estimatedMessage: "Bidding closed for this market",
    },

    // Test Market Tests (02:46 - 11:59)
    {
      name: "Test Market - During Bidding Window (06:00)",
      marketName: "Test Market - 02:46",
      testTime: "06:00",
      testTimeDate: createTestDate("06:00"),
      shouldSucceed: true,
      reason: "Current time (06:00) is within open (02:46) and close (11:59) window",
      estimatedStatus: 201,
      estimatedMessage: "Bid placed successfully",
    },
  ];

  // Display each scenario
  scenarios.forEach((scenario, index) => {
    const market = markets.find((m) => m.name === scenario.marketName);
    const openTime = parseTimeToMinutes(market?.openTime || "00:00");
    const closeTime = parseTimeToMinutes(market?.closeTime || "23:59");
    const testTime = parseTimeToMinutes(scenario.testTime);

    let windowStatus = "CLOSED";
    if (testTime >= openTime && testTime < closeTime) {
      windowStatus = "🟢 OPEN";
    } else if (testTime < openTime) {
      windowStatus = "🔴 NOT YET OPEN";
    } else {
      windowStatus = "🔴 CLOSED";
    }

    console.log(`\n${index + 1}. ${scenario.name}`);
    console.log(`   Test Time: ${scenario.testTime} IST`);
    console.log(`   Market Window: ${market?.openTime}-${market?.closeTime} IST`);
    console.log(`   Window Status: ${windowStatus}`);
    console.log(`   Reason: ${scenario.reason}`);
    console.log(`   Expected Result: ${scenario.shouldSucceed ? "✅ SUCCESS" : "❌ FAIL"}`);
    console.log(`   Expected HTTP Status: ${scenario.estimatedStatus}`);
    console.log(`   Expected Message: "${scenario.estimatedMessage}"`);
  });

  return scenarios;
}

// ============================================================================
// STEP 4: Show Bid Payload Structure
// ============================================================================

function displayBidPayloadStructure() {
  console.log("\n" + "=".repeat(80));
  console.log("STEP 3: BID PAYLOAD STRUCTURE");
  console.log("=".repeat(80));

  const examplePayloads = {
    single_digit: {
      marketId: 1,
      gameType: "single_digit",
      number: "5",
      amount: 100,
      description: "1 digit bet (0-9)",
    },
    jodi: {
      marketId: 1,
      gameType: "jodi",
      number: "45",
      amount: 200,
      description: "2 digit bet (00-99)",
    },
    single_panna: {
      marketId: 1,
      gameType: "single_panna",
      number: "123",
      amount: 500,
      description: "3 digit bet (000-999)",
    },
    full_sangam: {
      marketId: 1,
      gameType: "full_sangam",
      number: "123456",
      amount: 1000,
      description: "6 digit bet (3+3 combination)",
    },
  };

  console.log("\nSupported Game Types and Example Payloads:\n");

  Object.entries(examplePayloads).forEach(([gameType, payload]) => {
    console.log(`📋 Game Type: ${gameType}`);
    console.log(`   Description: ${payload.description}`);
    console.log(`   JSON Payload:`);
    console.log(`   ${JSON.stringify(payload, null, 2)}`);
    console.log();
  });

  console.log("Field Constraints:");
  console.log("  - marketId: positive integer (1, 2, 3...)");
  console.log("  - gameType: must be from supported list above");
  console.log("  - number: string of appropriate length (validated by gameType)");
  console.log("  - amount: number between 1-10000 (rupees)");
}

// ============================================================================
// STEP 5: Show API Testing Examples with Curl & Fetch
// ============================================================================

function displayAPITestExamples() {
  console.log("\n" + "=".repeat(80));
  console.log("STEP 4: TESTING VIA API - CURL & FETCH EXAMPLES");
  console.log("=".repeat(80));

  // Setup
  const apiBase = "http://localhost:3000/api";
  const authToken = "YOUR_JWT_TOKEN_HERE"; // Get from login
  const userId = 1; // Your user ID

  console.log("\n📌 Prerequisites:");
  console.log(`   1. Server running at: ${apiBase}`);
  console.log(`   2. You must have logged in to get authToken`);
  console.log(`   3. You must have sufficient wallet balance`);
  console.log(`   4. Replace placeholders with actual values`);

  // ========== EXAMPLE 1: SUCCESS SCENARIO ==========
  console.log("\n" + "─".repeat(80));
  console.log("EXAMPLE 1: SUCCESSFUL BID (Morning Market at 09:30)");
  console.log("─".repeat(80));

  console.log("\n🟢 CURL Command:");
  console.log(`
curl -X POST "${apiBase}/user/bids" \\
  -H "Authorization: Bearer ${authToken}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "marketId": 1,
    "gameType": "jodi",
    "number": "45",
    "amount": 100
  }'
  `);

  console.log("\n✅ Expected Response (201 Created):");
  console.log(`
{
  "id": 123,
  "userId": ${userId},
  "marketId": 1,
  "marketName": "Morning Market",
  "gameType": "jodi",
  "number": "45",
  "amount": 100,
  "openTime": "09:00",
  "closeTime": "11:00",
  "currentTime": "2024-03-23T09:30:00.000Z",
  "status": "pending",
  "createdAt": "2024-03-23T09:30:15.000Z"
}
  `);

  console.log("\n🟢 JavaScript Fetch Example:");
  console.log(`
async function placeBid() {
  const response = await fetch("${apiBase}/user/bids", {
    method: "POST",
    headers: {
      "Authorization": "Bearer ${authToken}",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      marketId: 1,
      gameType: "jodi",
      number: "45",
      amount: 100,
    }),
  });

  if (response.ok) {
    const bid = await response.json();
    console.log("✅ Bid placed successfully:", bid);
  } else {
    const error = await response.json();
    console.log("❌ Error:", error);
  }
}
  `);

  // ========== EXAMPLE 2: BEFORE MARKET OPENS ==========
  console.log("\n" + "─".repeat(80));
  console.log("EXAMPLE 2: FAIL - MARKET NOT YET OPEN (08:50)");
  console.log("─".repeat(80));

  console.log("\n🔴 CURL Command (same as above, but at 08:50):");
  console.log(`
curl -X POST "${apiBase}/user/bids" \\
  -H "Authorization: Bearer ${authToken}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "marketId": 1,
    "gameType": "jodi",
    "number": "45",
    "amount": 100
  }'
  `);

  console.log("\n❌ Expected Response (400 Bad Request):");
  console.log(`
{
  "error": "Market not yet open for bidding"
}
  `);

  // ========== EXAMPLE 3: AFTER MARKET CLOSES ==========
  console.log("\n" + "─".repeat(80));
  console.log("EXAMPLE 3: FAIL - MARKET CLOSED (11:15)");
  console.log("─".repeat(80));

  console.log("\n🔴 CURL Command (same as above, but at 11:15):");
  console.log(`
curl -X POST "${apiBase}/user/bids" \\
  -H "Authorization: Bearer ${authToken}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "marketId": 1,
    "gameType": "jodi",
    "number": "45",
    "amount": 100
  }'
  `);

  console.log("\n❌ Expected Response (400 Bad Request):");
  console.log(`
{
  "error": "Bidding closed for this market"
}
  `);

  // ========== EXAMPLE 4: INSUFFICIENT BALANCE ==========
  console.log("\n" + "─".repeat(80));
  console.log("EXAMPLE 4: FAIL - INSUFFICIENT BALANCE");
  console.log("─".repeat(80));

  console.log("\n🔴 CURL Command:");
  console.log(`
curl -X POST "${apiBase}/user/bids" \\
  -H "Authorization: Bearer ${authToken}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "marketId": 1,
    "gameType": "jodi",
    "number": "45",
    "amount": 50000
  }'
  `);

  console.log("\n❌ Expected Response (400 Bad Request):");
  console.log(`
{
  "error": "Insufficient balance"
}
  `);

  // ========== EXAMPLE 5: INVALID BID NUMBER ==========
  console.log("\n" + "─".repeat(80));
  console.log("EXAMPLE 5: FAIL - INVALID BID NUMBER FOR GAME TYPE");
  console.log("─".repeat(80));

  console.log("\n🔴 CURL Command (2 digits for single_digit game - invalid):");
  console.log(`
curl -X POST "${apiBase}/user/bids" \\
  -H "Authorization: Bearer ${authToken}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "marketId": 1,
    "gameType": "single_digit",
    "number": "45",
    "amount": 100
  }'
  `);

  console.log("\n❌ Expected Response (400 Bad Request):");
  console.log(`
{
  "error": "Invalid bid number for selected game type"
}
  `);

  // ========== EXAMPLE 6: DUPLICATE BID ==========
  console.log("\n" + "─".repeat(80));
  console.log("EXAMPLE 6: FAIL - DUPLICATE BID");
  console.log("─".repeat(80));

  console.log("\n🔴 CURL Command (same bid twice):");
  console.log(`
# First call - succeeds
curl -X POST "${apiBase}/user/bids" \\
  -H "Authorization: Bearer ${authToken}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "marketId": 1,
    "gameType": "jodi",
    "number": "45",
    "amount": 100
  }'

# Second call - fails (same market, game type, number)
curl -X POST "${apiBase}/user/bids" \\
  -H "Authorization: Bearer ${authToken}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "marketId": 1,
    "gameType": "jodi",
    "number": "45",
    "amount": 100
  }'
  `);

  console.log("\n❌ Expected Response on Second Call (409 Conflict):");
  console.log(`
{
  "error": "Duplicate bid not allowed"
}
  `);

  // ========== EXAMPLE 7: VIEW ALL BIDS ==========
  console.log("\n" + "─".repeat(80));
  console.log("EXAMPLE 7: GET ALL YOUR BIDS");
  console.log("─".repeat(80));

  console.log("\n🔵 CURL Command:");
  console.log(`
curl -X GET "${apiBase}/user/bids" \\
  -H "Authorization: Bearer ${authToken}"
  `);

  console.log("\n✅ Expected Response (200 OK):");
  console.log(`
{
  "bids": [
    {
      "id": 123,
      "userId": ${userId},
      "marketName": "Morning Market",
      "gameType": "jodi",
      "number": "45",
      "amount": 100,
      "openTime": "09:00",
      "closeTime": "11:00",
      "status": "pending",
      "createdAt": "2024-03-23T09:30:15.000Z"
    },
    {
      "id": 124,
      "userId": ${userId},
      "marketName": "Evening Market",
      "gameType": "single_digit",
      "number": "7",
      "amount": 50,
      "openTime": "16:00",
      "closeTime": "18:00",
      "status": "pending",
      "createdAt": "2024-03-23T16:45:20.000Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20
}
  `);
}

// ============================================================================
// STEP 6: Authentication & Setup Guide
// ============================================================================

function displayTestingGuide() {
  console.log("\n" + "=".repeat(80));
  console.log("STEP 5: STEP-BY-STEP TESTING GUIDE");
  console.log("=".repeat(80));

  console.log(`
1️⃣  LOGIN & GET AUTH TOKEN
   ├─ Endpoint: POST /auth/login
   ├─ Payload:
   │  {
   │    "email": "user@example.com",
   │    "password": "password123"
   │  }
   └─ Response includes: { token: "eyJhbGc..." }

2️⃣  CHECK/CREATE USER BALANCE
   ├─ Endpoint: GET /user/profile
   ├─ Header: Authorization: Bearer <TOKEN>
   └─ Response: { walletBalance: 1000, ... }

3️⃣  GET AVAILABLE MARKETS
   ├─ Endpoint: GET /user/markets
   ├─ Header: Authorization: Bearer <TOKEN>
   └─ Shows: market ID, name, open/close times

4️⃣  PLACE BID (during market hours)
   ├─ Endpoint: POST /user/bids
   ├─ Header: Authorization: Bearer <TOKEN>
   ├─ Payload:
   │  {
   │    "marketId": 1,
   │    "gameType": "jodi",
   │    "number": "45",
   │    "amount": 100
   │  }
   └─ Success: 201, Error: 400/409/403

5️⃣  VIEW YOUR BIDS
   ├─ Endpoint: GET /user/bids
   ├─ Header: Authorization: Bearer <TOKEN>
   └─ Shows: all your bids with status

6️⃣  MONITOR RESULTS (after market closes)
   ├─ Endpoint: GET /results
   ├─ Header: Authorization: Bearer <TOKEN>
   └─ Shows: winning numbers for each market

IMPORTANT TIME CONSIDERATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• All times in system are IST (Indian Standard Time)
• Bidding OPENS at: market openTime (e.g., 09:00)
• Bidding CLOSES at: market closeTime (e.g., 11:00)
• A bid placed exactly at closeTime will be REJECTED
• To test with curl: run commands from terminal exactly at specified times
• Use sleep command to schedule curl execution: sleep 30m && curl ...

TIME WINDOW LOGIC:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (currentTime < openTime) → "Market not yet open"
  if (openTime ≤ currentTime < closeTime) → ✅ Accept bid
  if (currentTime ≥ closeTime) → "Bidding closed"
  `);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.clear();
  console.log("╔" + "═".repeat(78) + "╗");
  console.log("║" + " ".repeat(15) + "MARKET BIDDING TEST SCRIPT" + " ".repeat(37) + "║");
  console.log("║" + " ".repeat(10) + "Comprehensive Testing with Scenarios & Examples" + " ".repeat(22) + "║");
  console.log("╚" + "═".repeat(78) + "╝");

  try {
    // Step 1: Display markets
    const markets = await displayActiveMarkets();

    // Step 2: Run test scenarios
    await runTestScenarios(markets);

    // Step 3: Show bid payload structure
    displayBidPayloadStructure();

    // Step 4: Show API testing examples
    displayAPITestExamples();

    // Step 5: Show testing guide
    displayTestingGuide();

    // Summary
    console.log("\n" + "=".repeat(80));
    console.log("SUMMARY");
    console.log("=".repeat(80));
    console.log(`
✅ This script shows:
   • Active markets with bidding windows
   • Test scenarios and expected outcomes
   • Bid payload structure for each game type
   • Complete curl and fetch examples
   • All possible error scenarios
   • Step-by-step testing guide

🎯 Next Steps:
   1. Start the API server: cd artifacts/api-server && pnpm dev
   2. Get your auth token by logging in via the admin panel
   3. Use a market ID from Step 1 in your API calls
   4. Execute curl commands at the specified times
   5. Observe how bids succeed/fail based on market hours

📝 Key Points:
   • Times are in IST (Asia/Kolkata timezone)
   • Bids fail if placed before openTime or at/after closeTime
   • Each user can have max 1 bid per market/gameType/number
   • Bid amount must not exceed wallet balance
   • Bid number format must match the game type
    `);

    console.log("\n" + "=".repeat(80));
    console.log("Test script completed. Review the scenarios above.");
    console.log("=".repeat(80) + "\n");
  } catch (error) {
    console.error("Error running test script:", error);
    process.exit(1);
  }
}

main();
