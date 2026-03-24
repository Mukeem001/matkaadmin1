import axios from "axios";

async function inspect() {
  const url = "https://satkamatka.com.in/";
  console.log(`Fetching ${url} ...`);
  const res = await axios.get(url, {
    timeout: 15000,
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  });
  const body = res.data as string;

  const search = (term: string) => {
    const idx = body.indexOf(term);
    return idx >= 0 ? `found at ${idx}` : "not found";
  };

  console.log("\n=== Date text search ===");
  ["16 March 2026", "16/03/2026", "16-03-2026", "17 March 2026", "17/03/2026"].forEach((t) => {
    console.log(`${t}: ${search(t)}`);
  });

  console.log("\n=== KALYAN MORNING lines ===");
  const lines = body.split(/\n|\r/).map((l) => l.trim());
  const kmLines = lines.filter((l) => l.toUpperCase().includes("KALYAN MORNING"));
  console.log(`Found ${kmLines.length} lines containing KALYAN MORNING`);
  kmLines.slice(0, 20).forEach((l) => console.log(l));

  console.log("\n=== Sample lines containing 'JODI' ===");
  const jodiLines = lines.filter((l) => l.toUpperCase().includes("JODI"));
  console.log(`Found ${jodiLines.length} lines containing JODI`);
  jodiLines.slice(0, 20).forEach((l) => console.log(l));
}

inspect().catch((err) => {
  console.error(err);
  process.exit(1);
});
