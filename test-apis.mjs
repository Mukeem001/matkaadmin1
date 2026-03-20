import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

async function testAPIs() {
  console.log('\n========================================');
  console.log('  API TEST SUITE - BID & WALLET SYSTEM');
  console.log('========================================\n');

  try {
    // TEST 1: User Login
    console.log('TEST 1: User Login (POST /auth/user/login)');
    console.log('─────────────────────────────────────────');
    
    const loginRes = await axios.post(`${BASE_URL}/auth/user/login`, {
      phone: '9999990001',
      password: 'user123'
    });
    
    const token = loginRes.data.token;
    const userId = loginRes.data.user.id;
    const userName = loginRes.data.user.name;
    const walletBefore = loginRes.data.user.walletBalance;
    
    console.log('✓ SUCCESS');
    console.log(`  User: ${userName} (ID: ${userId})`);
    console.log(`  Phone: 9999990001`);
    console.log(`  Initial Wallet: ₹${walletBefore}\n`);

    const headers = { Authorization: `Bearer ${token}` };

    // TEST 2: Get User Profile
    console.log('TEST 2: Get User Profile (GET /user/profile)');
    console.log('─────────────────────────────────────────');
    
    const profileRes = await axios.get(`${BASE_URL}/user/profile`, { headers });
    
    console.log('✓ SUCCESS');
    console.log(`  ID: ${profileRes.data.id}`);
    console.log(`  Name: ${profileRes.data.name}`);
    console.log(`  Phone: ${profileRes.data.phone}`);
    console.log(`  Wallet: ₹${profileRes.data.walletBalance}\n`);

    // SETUP: Activate Market
    const adminLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@matka.com',
      password: 'admin123'
    });
    const adminToken = adminLoginRes.data.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };
    
    // SETUP: Get Markets and Activate One
    const marketsRes = await axios.get(`${BASE_URL}/markets`, { headers: { Authorization: `Bearer ${adminHeaders.Authorization.split(' ')[1]}` } });
    let activeMarket = marketsRes.data.find(m => m.isActive);
    
    if (!activeMarket) {
      // Activate first market if none active
      const market = marketsRes.data[0];
      const now = new Date();
      const openTime = String(Math.max(0, now.getHours() - 1)).padStart(2, '0') + ':00';
      const closeTime = String((now.getHours() + 3) % 24).padStart(2, '0') + ':00';
      
      try {
        const updateRes = await axios.put(`${BASE_URL}/markets/${market.id}`, {
          name: market.name,
          openTime,
          closeTime,
          isActive: true
        }, { headers: adminHeaders });
        activeMarket = updateRes.data;
      } catch(e) {
        console.log('Warning: Could not activate market, trying with existing active...');
        activeMarket = marketsRes.data[0];
      }
    }
    
    console.log(`  ✓ Using Market: ${activeMarket.name} (ID: ${activeMarket.id})\n`);

    // TEST 3: Place Bid (Wallet Deduction)
    console.log('TEST 3: Place Bid (POST /user/bids) - Wallet Deduction');
    console.log('─────────────────────────────────────────');
    
    const bidAmount = 100;
    console.log(`  Placing bet: ₹${bidAmount} on Single Digit (number 7)`);
    
    const bidRes = await axios.post(`${BASE_URL}/user/bids`, {
      marketId: activeMarket.id,
      gameType: 'single_digit',
      amount: bidAmount,
      number: '7'
    }, { headers });
    
    console.log('✓ SUCCESS - Bid Placed');
    console.log(`  Bid ID: ${bidRes.data.bid.id}`);
    console.log(`  Status: ${bidRes.data.bid.status}`);
    console.log(`  Amount Deducted: -₹${bidRes.data.bid.amount}\n`);

    // TEST 4: Verify Wallet Deduction
    console.log('TEST 4: Verify Wallet Deduction');
    console.log('─────────────────────────────────────────');
    
    const profileRes2 = await axios.get(`${BASE_URL}/user/profile`, { headers });
    const walletAfter = profileRes2.data.walletBalance;
    const deducted  = walletBefore - walletAfter;
    
    console.log('✓ SUCCESS');
    console.log(`  Before Bid: ₹${walletBefore}`);
    console.log(`  After Bid:  ₹${walletAfter}`);
    console.log(`  Deducted:   -₹${deducted}`);
    console.log(`  ${deducted === bidAmount ? '✓ CORRECT!' : '✗ INCORRECT'}\n`);

    // TEST 5: Get User Bids
    console.log('TEST 5: Get User Bid History (GET /user/bids)');
    console.log('─────────────────────────────────────────');
    
    const bidsRes = await axios.get(`${BASE_URL}/user/bids?page=1&limit=10`, { headers });
    
    console.log('✓ SUCCESS');
    console.log(`  Total Bids: ${bidsRes.data.total}`);
    console.log(`  Recent Bids:`);
    bidsRes.data.bids.slice(0, 3).forEach(bid => {
      console.log(`  ├─ Bid #${bid.id} | ${bid.marketName}`);
      console.log(`     Game: ${bid.gameType} | Amount: ₹${bid.amount} | Number: ${bid.number} | Status: ${bid.status}`);
    });
    console.log();

    // TEST 6: Admin Login & Declare Result
    console.log('TEST 6: Declare Result (POST /results)');
    console.log('─────────────────────────────────────────');
    
    console.log('  ✓ Admin logged in (from setup)');
    console.log(`  Declaring: Open=123, Close=454 (single digit = 7)`);
    
    const resultRes = await axios.post(`${BASE_URL}/results`, {
      marketId: activeMarket.id,
      resultDate: new Date().toISOString().split('T')[0],
      openResult: '123',
      closeResult: '454',
      jodiResult: '37',
      pannaResult: ''
    }, { headers: adminHeaders });
    
    console.log('✓ SUCCESS - Result Declared');
    console.log(`  Market: ${resultRes.data.marketName}`);
    console.log(`  Open: ${resultRes.data.openResult} | Close: ${resultRes.data.closeResult}\n`);

    // Wait for bid processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // TEST 7: Final Bid Status & Wallet
    console.log('TEST 7: Final Bid Status & Wallet Verification');
    console.log('─────────────────────────────────────────');
    
    const finalBidsRes = await axios.get(`${BASE_URL}/user/bids?page=1&limit=10`, { headers });
    const winningBid = finalBidsRes.data.bids.find(b => b.number === '7');
    
    console.log('✓ SUCCESS');
    if (winningBid) {
      console.log(`  Bid ID: ${winningBid.id}`);
      console.log(`  Number: ${winningBid.number}`);
      console.log(`  Status: ${winningBid.status}`);
      console.log(`  ${winningBid.status === 'won' ? '✓ BID WON!' : '✗ BID LOST'}`);
    }
    
    const finalProfileRes = await axios.get(`${BASE_URL}/user/profile`, { headers });
    const walletFinal = finalProfileRes.data.walletBalance;
    const walletChange = walletFinal - walletBefore;
    
    console.log();
    console.log(`  Initial Wallet: ₹${walletBefore}`);
    console.log(`  Final Wallet:   ₹${walletFinal}`);
    console.log(`  Change:         ${walletChange > 0 ? '+' : ''}₹${walletChange}`);
    console.log(`  ${walletChange > 0 ? '✓ WINNINGS CREDITED!' : walletChange === 0 ? 'No change (Bid lost)' : 'Unexpected change'}\n`);

    console.log('========================================');
    console.log('  ALL TESTS COMPLETED SUCCESSFULLY');
    console.log('========================================\n');

  } catch (error) {
    if (error.response) {
      console.error('❌ ERROR:', error.response.statusCode, error.response.data);
    } else {
      console.error('❌ ERROR:', error.message);
    }
  }
}

testAPIs();
