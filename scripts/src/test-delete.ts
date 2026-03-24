async function testDeleteMarket() {
  // Login first
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

  // Get markets first
  const marketsRes = await fetch("http://localhost:4000/api/markets", {
    headers: {
      "Authorization": `Bearer ${loginData.token}`,
    },
  });

  const markets = await marketsRes.json();
  console.log("Markets:", markets.map(m => ({ id: m.id, name: m.name })));

  // Try to delete a market that might not have bids (let's try one that was created recently)
  const marketToDelete = markets.find(m => m.name.includes("MORNING") || m.name.includes("EVENING"));
  if (!marketToDelete) {
    console.log("No suitable market found to delete");
    return;
  }

  console.log(`Attempting to delete market: ${marketToDelete.name} (ID: ${marketToDelete.id})`);

  const deleteRes = await fetch(`http://localhost:4000/api/markets/${marketToDelete.id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${loginData.token}`,
    },
  });

  const deleteData = await deleteRes.json();
  console.log("Delete response:", deleteData);
}

testDeleteMarket().catch(console.error);