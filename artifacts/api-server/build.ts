import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildAll() {
  console.log("building server with TypeScript...");
  
  try {
    // Build with project references enabled (-b flag)
    // This builds lib/db, lib/api-zod, and api-server in order
    execSync("npx tsc --build tsconfig.json", {
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
