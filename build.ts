import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildAll() {
  console.log("🔨 Building Express API Server for Hostinger...");
  
  try {
    // Step 1: Compile TypeScript to JavaScript
    console.log("📝 Compiling TypeScript...");
    execSync("npx tsc --project tsconfig.json --outDir dist --rootDir src", {
      cwd: __dirname,
      stdio: "inherit",
    });
    
    console.log("✅ Build complete!");
    console.log("📂 Output: dist/index.js");
    console.log("🚀 Ready to deploy!");
  } catch (err) {
    console.error("❌ Build failed:", err);
    process.exit(1);
  }
}

buildAll().catch((err) => {
  console.error("❌ Build error:", err);
  process.exit(1);
});
