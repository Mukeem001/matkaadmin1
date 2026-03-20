async function analyzeWebsite() {
  try {
    const response = await fetch("https://satkamatka.com.in/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const html = await response.text();
    console.log("Response status:", response.status);
    console.log("Content length:", html.length);

    // Simple text extraction
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log("First 1000 characters of text:");
    console.log(text.substring(0, 1000));

    // Look for patterns like market names followed by numbers
    const lines = text.split('.').map(l => l.trim()).filter(l => l && l.length > 10);
    console.log("\nPotential result lines:");
    for (const line of lines.slice(0, 30)) {
      if (line.match(/\d{1,3}/) && (line.toUpperCase().includes('BAZAR') || line.toUpperCase().includes('MORNING') || line.toUpperCase().includes('MARKET'))) {
        console.log("-", line);
      }
    }

  } catch (error) {
    console.error("Error fetching website:", error);
  }
}

analyzeWebsite();