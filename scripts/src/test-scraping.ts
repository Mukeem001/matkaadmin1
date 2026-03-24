async function testScraping() {
  // Login
  const loginRes = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@matka.com", password: "admin123" }),
  });

  const loginData = await loginRes.json();
  console.log("Login response:", loginData);

  if (!loginData.token) {
    console.error("Login failed");
    return;
  }

  // Fetch market results
  const fetchRes = await fetch("http://localhost:4000/api/scraper/markets/13/fetch-now", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${loginData.token}`,
    },
  });

  const fetchData = await fetchRes.json();
  console.log("Fetch response:", fetchData);
}

testScraping().catch(console.error);