import axios from "axios";

async function testFetchNow() {
  // Login first
  const loginRes = await axios.post("http://localhost:4000/api/auth/login", {
    email: "admin@matka.com",
    password: "admin123",
  });

  const token = loginRes.data.token;
  console.log("✓ Login successful");

  // Test fetch-now for market 1 (KALYAN MORNING)
  const fetchRes = await axios.post(
    "http://localhost:4000/api/markets/1/fetch-now",
    {},
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("\n=== Fetch-Now Response ===");
  console.log("Status:", fetchRes.status);
  console.log("Data:", JSON.stringify(fetchRes.data, null, 2));

  // Now try to fetch the saved results
  const savedRes = await axios.get(
    "http://localhost:4000/api/markets/1/results/2026-03-17",
    {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }
  );

  console.log("\n=== Saved Results from Database ===");
  console.log("Status:", savedRes.status);
  console.log("Data:", JSON.stringify(savedRes.data, null, 2));
}

testFetchNow().catch((err) => {
  console.error(
    "Error:",
    err.response?.data || err.message
  );
  process.exit(1);
});
