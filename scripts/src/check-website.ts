import axios from "axios";
import * as cheerio from "cheerio";

async function checkWebsite() {
  try {
    console.log('Fetching satkamatka.com.in...');
    const response = await axios.get('https://satkamatka.com.in/', {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const text = $('body').text();

    console.log('Title:', $('title').text());
    console.log('Body text length:', text.length);

    // Look for result patterns
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5);

    console.log('\n=== LINES WITH DIGIT PATTERNS ===');
    lines.filter(line => /\d{1,3}-\d{1,3}-\d{1,3}/.test(line)).forEach(line => {
      console.log('-', line);
    });

    console.log('\n=== LINES WITH "JODI" ===');
    lines.filter(line => line.toUpperCase().includes('JODI')).forEach(line => {
      console.log('-', line);
    });

    console.log('\n=== LINES WITH MARKET NAMES ===');
    const marketNames = ['SRIDEVI', 'TIME BAZAR', 'KALYAN', 'MILAN', 'MAIN BAZAR'];
    marketNames.forEach(name => {
      const matchingLines = lines.filter(line => line.toUpperCase().includes(name));
      if (matchingLines.length > 0) {
        console.log(`\n${name}:`);
        matchingLines.slice(0, 3).forEach(line => console.log('  -', line));
      }
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkWebsite();