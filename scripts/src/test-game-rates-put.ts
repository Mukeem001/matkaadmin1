import "dotenv/config";

async function main() {
  const loginRes = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@matka.com", password: "admin123" }),
  });

  const loginJson = await loginRes.json();
  const token = loginJson.token;
  console.log("token", token?.slice(0, 20));

  const putRes = await fetch("http://localhost:4000/api/game-rates", {
    method: "PUT",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({
      singleDigit: 11,
      jodiDigit: 111,
      singlePanna: 1111,
      doublePanna: 11111,
      triplePanna: 111111,
      halfSangam: 1111111,
      fullSangam: 11111111,
    }),
  });

  console.log("PUT status", putRes.status);
  console.log(await putRes.text());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
