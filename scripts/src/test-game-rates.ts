async function main() {
  const loginRes = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@matka.com", password: "admin123" }),
  });

  const loginJson = await loginRes.json();
  console.log("login status", loginRes.status, loginJson);

  const token = loginJson.token;
  const ratesRes = await fetch("http://localhost:4000/api/game-rates", {
    headers: { authorization: `Bearer ${token}` },
  });

  console.log("rates status", ratesRes.status);
  console.log(await ratesRes.text());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
