import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildAll() {
  console.log("building server with TypeScript...");
  
  // Simple approach: Just compile TypeScript to JavaScript
  // No bundling needed - Node.js loads modules naturally at runtime
  try {
    execSync("npx tsc -p tsconfig.json", {
      cwd: __dirname,
      stdio: "inherit",
    });
    console.log("Build complete ✅");
  } catch (err) {
    console.error("Build failed:", err);
    process.exit(1);
  }
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
