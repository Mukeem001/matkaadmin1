const API_URL = 'http://localhost:3000/api';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoxLCJpYXQiOjE3MDk4MzUwMDB9.K7bkM-VF0U5-VZ2Q6e5-5e5-5e5-5e5-5e5-5e5-5e5';

async function testDashboardAPI() {
  console.log('🔍 Testing Dashboard Stats API...\n');
  
  try {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Status: ${response.status}\n`);

    const data = await response.json();
    console.log('Response Data:');
    console.log(JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ API is working!');
      console.log(`- Total Users: ${data.totalUsers}`);
      console.log(`- Bids Today: ${data.totalBidsToday}`);
      console.log(`- Active Markets: ${data.activeMarkets}`);
      console.log(`- Recent Bids: ${data.recentBids.length}`);
    } else {
      console.log('\n❌ API returned an error');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️ Make sure:');
    console.log('1. API server is running (pnpm dev in artifacts/api-server)');
    console.log('2. Database is working');
    console.log('3. API has built successfully');
  }
}

testDashboardAPI();
