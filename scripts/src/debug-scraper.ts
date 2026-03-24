import { fetchAndUpdateMarketResult, scrapeResult } from "../../artifacts/api-server/src/lib/scraper.js";

async function debugScraper() {
  console.log('=== SCRAPER DEBUG ===');

  // Test direct scraping
  console.log('\n1. Testing direct scrape for satkamatka.com.in with KALYAN MORNING...');
  try {
    const directResult = await scrapeResult('https://satkamatka.com.in/', 'KALYAN MORNING');
    console.log('Direct scrape result:', directResult);
  } catch (error) {
    console.error('Direct scrape error:', error instanceof Error ? error.message : String(error));
  }

  // Test full market update
  console.log('\n2. Testing full market update for market ID 1...');
  try {
    const result = await fetchAndUpdateMarketResult(1);
    console.log('Market update result:', result);
  } catch (error) {
    console.error('Market update error:', error instanceof Error ? error.message : String(error));
  }

  // Test website content
  console.log('\n3. Testing website content fetch...');
  try {
    const axios = (await import('axios')).default;
    const response = await axios.get('https://satkamatka.com.in/', {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const { load } = await import('cheerio');
    const $ = load(response.data);
    const text = $('body').text();

    console.log('Website title:', $('title').text());
    console.log('Body text length:', text.length);
    console.log('First 500 chars:', text.substring(0, 500));
    console.log('First 1000 chars of HTML:', response.data.substring(0, 1000));

    // Look for SRIDEVI
    const lines = text.split('\n').map(l => l.trim()).filter(l => l && l.length > 10);
    console.log('\nLines containing SRIDEVI:');
    lines.filter(line => line.toUpperCase().includes('SRIDEVI')).slice(0, 5).forEach(line => {
      console.log('-', line);
    });

  } catch (error) {
    console.error('Website fetch error:', error instanceof Error ? error.message : String(error));
  }
}

debugScraper().catch(console.error);