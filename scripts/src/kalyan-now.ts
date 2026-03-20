import axios from "axios";
import { load } from "cheerio";

async function main() {
  const url = "https://satkamatka.com.in/";
  const res = await axios.get(url, {
    timeout: 15000,
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  });
  const $ = load(res.data);

  // Try to locate the KALYAN MORNING section in the DOM and find the first 3-number result.
  const gameElem = $(".game_name").filter((_, el) => $(el).text().trim().toUpperCase() === "KALYAN MORNING");
  if (gameElem.length === 0) {
    console.log("Could not find the KALYAN MORNING game element.");
    return;
  }

  const container = gameElem.parent();
  const containerText = container.text().replace(/\s+/g, " ").trim();
  const match = containerText.match(/(\d{1,3})-(\d{1,3})-(\d{1,3})/);

  console.log("=== KALYAN MORNING container text (truncated) ===");
  console.log(containerText.slice(0, 500));

  if (!match) {
    console.log("No numeric result found in the KALYAN MORNING section.");
    return;
  }

  console.log("KALYAN MORNING result:", `${match[1]}-${match[2]}-${match[3]}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
