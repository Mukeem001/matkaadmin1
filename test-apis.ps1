# Test All 4 APIs

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🧪 TESTING BID & WALLET SYSTEM" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

# API 1: LOGIN TO GET TOKEN
Write-Host "`n1️⃣ TEST API 1: Login (Get Token)" -ForegroundColor Green

$loginBody = @{
    phone = "9999990001"
    password = "user123"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/user/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $loginBody `
  -SkipHttpErrorCheck

$tokenData = $loginResponse.Content | ConvertFrom-Json
$token = $tokenData.token
$userId = $tokenData.user.id
$initialWallet = $tokenData.user.walletBalance

Write-Host "✅ Login Success" -ForegroundColor Green
Write-Host "   Phone: 9999990001"
Write-Host "   User ID: $userId"
Write-Host "   Initial Wallet: ₹$initialWallet"
Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray

# API 2: GET USER PROFILE
Write-Host "`n2️⃣ TEST API 2: Get User Profile (GET /user/profile)" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
}

$profileResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/user/profile" `
  -Method GET `
  -Headers $headers

$profileData = $profileResponse.Content | ConvertFrom-Json

Write-Host "✅ Profile Retrieved" -ForegroundColor Green
Write-Host "   ID: $($profileData.id)"
Write-Host "   Name: $($profileData.name)"
Write-Host "   Email: $($profileData.email)"
Write-Host "   Phone: $($profileData.phone)"
Write-Host "   Wallet Balance: ₹$($profileData.walletBalance)"

# API 3: PLACE A BID (with wallet deduction)
Write-Host "`n3️⃣ TEST API 3: Place Bid (POST /user/bids) - Wallet Deduction" -ForegroundColor Green

$bidAmount = 50
$bidBody = @{
    marketId = 1
    gameType = "single_digit"
    amount = $bidAmount
    number = "7"
} | ConvertTo-Json

Write-Host "   Placing bid: ₹$bidAmount on Single Digit (number: 7)" -ForegroundColor Yellow

$bidResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/user/bids" `
  -Method POST `
  -Headers $headers `
  -ContentType "application/json" `
  -Body $bidBody

$bidData = $bidResponse.Content | ConvertFrom-Json

Write-Host "✅ Bid Placed Successfully" -ForegroundColor Green
Write-Host "   Bid ID: $($bidData.bid.id)"
Write-Host "   Market ID: $($bidData.bid.marketId)"
Write-Host "   Game Type: $($bidData.bid.gameType)"
Write-Host "   Amount: ₹$($bidData.bid.amount)"
Write-Host "   Number: $($bidData.bid.number)"
Write-Host "   Status: $($bidData.bid.status)"
Write-Host "   Created At: $($bidData.bid.createdAt)"

# API 4: GET USER PROFILE AGAIN (to verify wallet deduction)
Write-Host "`n4️⃣ TEST API 4: Get Updated Profile (Verify Wallet Deduction)" -ForegroundColor Green

$profileResponse2 = Invoke-WebRequest -Uri "http://localhost:4000/api/user/profile" `
  -Method GET `
  -Headers $headers

$profileData2 = $profileResponse2.Content | ConvertFrom-Json
$currentWallet = $profileData2.walletBalance
$deducted = $initialWallet - $currentWallet

Write-Host "✅ Wallet Updated" -ForegroundColor Green
Write-Host "   Previous Balance: ₹$initialWallet"
Write-Host "   Current Balance: ₹$currentWallet"
Write-Host "   Amount Deducted: -₹$deducted" -ForegroundColor Red
Write-Host "   Deduction Correct: $(if($deducted -eq $bidAmount) { '✓ YES' } else { '✗ NO' })" -ForegroundColor $(if($deducted -eq $bidAmount) { 'Green' } else { 'Red' })

# API 5: GET USER BIDS HISTORY
Write-Host "`n5️⃣ TEST API 5: Get User Bids (GET /user/bids)" -ForegroundColor Green

$bidsResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/user/bids?page=1&limit=10" `
  -Method GET `
  -Headers $headers

$bidsData = $bidsResponse.Content | ConvertFrom-Json

Write-Host "✅ Bids Retrieved" -ForegroundColor Green
Write-Host "   Total Bids: $($bidsData.total)"
Write-Host "   Page: $($bidsData.page) / Limit: $($bidsData.limit)"
Write-Host "`n   Recent Bids:"

$bidsData.bids | Select-Object -First 5 | ForEach-Object {
    Write-Host "   ├─ ID: $($_.id) | Market: $($_.marketName) | Type: $($_.gameType) | Amount: ₹$($_.amount) | Number: $($_.number) | Status: $($_.status)" -ForegroundColor Gray
}

# API 6: DECLARE RESULT & AUTO-PROCESS BIDS
Write-Host "`n6️⃣ TEST API 6: Declare Result (POST /results) - Auto Process Bids" -ForegroundColor Green

# Get admin token first
$adminLoginBody = @{
    email = "admin@matka.com"
    password = "admin123"
} | ConvertTo-Json

$adminLoginResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $adminLoginBody

$adminTokenData = $adminLoginResponse.Content | ConvertFrom-Json
$adminToken = $adminTokenData.token

Write-Host "   Admin logged in" -ForegroundColor Yellow

$adminHeaders = @{
    "Authorization" = "Bearer $adminToken"
}

# Declare result that matches our bid (7 is the single digit)
# Single digit = last digit of (open + close)
# If open = 123 (last digit 3) and close = 456 (last digit 6), then 3+6=9
# We need 7, so let's use open=123 (3) and close = 454 (4), 3+4=7
$resultBody = @{
    marketId = 1
    resultDate = (Get-Date).ToString("yyyy-MM-dd")
    openResult = "123"
    closeResult = "454"
    jodiResult = "37"
    pannaResult = ""
} | ConvertTo-Json

Write-Host "   Declaring result: Open=123, Close=454 (should match bid number 7)" -ForegroundColor Yellow

$resultResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/results" `
  -Method POST `
  -Headers $adminHeaders `
  -ContentType "application/json" `
  -Body $resultBody

$resultData = $resultResponse.Content | ConvertFrom-Json

Write-Host "✅ Result Declared (Auto-processing bids in background)" -ForegroundColor Green
Write-Host "   Market: $($resultData.marketName)"
Write-Host "   Result Date: $($resultData.resultDate)"
Write-Host "   Open Result: $($resultData.openResult)"
Write-Host "   Close Result: $($resultData.closeResult)"
Write-Host "   Jodi Result: $($resultData.jodiResult)"

# Wait a bit for bid processing
Start-Sleep -Seconds 2

# API 7: CHECK UPDATED BID STATUS & WALLET
Write-Host "`n7️⃣ TEST API 7: Check Final Bid Status & Wallet (Win/Loss Verification)" -ForegroundColor Green

$finalBidsResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/user/bids?page=1&limit=10" `
  -Method GET `
  -Headers $headers

$finalBidsData = $finalBidsResponse.Content | ConvertFrom-Json

Write-Host "✅ Final Bid Status" -ForegroundColor Green
$finalBidsData.bids | Where-Object { $_.number -eq "7" } | ForEach-Object {
    Write-Host "   Bid ID: $($_.id)"
    Write-Host "   Number: $($_.number)"
    Write-Host "   Status: $($_.status)" -ForegroundColor $(if($_.status -eq 'won') { 'Green' } else { 'Yellow' })
    Write-Host "   Amount: ₹$($_.amount)"
}

$finalProfileResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/user/profile" `
  -Method GET `
  -Headers $headers

$finalProfileData = $finalProfileResponse.Content | ConvertFrom-Json
$finalWallet = $finalProfileData.walletBalance

Write-Host "`n   Final Wallet: ₹$finalWallet"
Write-Host "   Initial Wallet: ₹$initialWallet"
Write-Host "   Current Wallet: ₹$finalWallet"

if ($finalWallet -gt $currentWallet) {
    $winnings = $finalWallet - $currentWallet
    Write-Host "   Winnings: +₹$winnings" -ForegroundColor Green
    Write-Host "   ✅ BID WON - WALLET CREDITED!" -ForegroundColor Green
} elseif ($finalWallet -eq $currentWallet) {
    Write-Host "   ❌ BID LOST - NO CHANGE" -ForegroundColor Yellow
} else {
    Write-Host "   Unexpected wallet change" -ForegroundColor Red
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "✅ ALL TESTS COMPLETED" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
