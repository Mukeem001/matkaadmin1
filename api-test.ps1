# Complete API Test Suite - Bid & Wallet System

Write-Host "`n" -NoNewline
Write-Host "==========================================`n" -ForegroundColor Cyan
Write-Host "  🧪 COMPREHENSIVE API TEST SUITE  `n" -ForegroundColor Yellow
Write-Host "==========================================`n" -ForegroundColor Cyan

# ============== TEST 1: USER LOGIN ==============
Write-Host "TEST 1: User Login (POST /auth/user/login)" -ForegroundColor Green
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

$loginBody = @{
    phone = "9999990001"
    password = "user123"
} | ConvertTo-Json

try {
    $loginResp = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/user/login" `
      -Method POST `
      -ContentType "application/json" `
      -Body $loginBody `
      -SkipHttpErrorCheck
    
    $resp = $loginResp.Content | ConvertFrom-Json
    
    if ($loginResp.StatusCode -eq 200) {
        $token = $resp.token
        $userId = $resp.user.id
        $userName = $resp.user.name
        $walletBefore = $resp.user.walletBalance
        
        Write-Host "✅ SUCCESS" -ForegroundColor Green
        Write-Host "   User: $userName (ID: $userId)" -ForegroundColor Green
        Write-Host "   Phone: 9999990001" -ForegroundColor Green
        Write-Host "   Initial Wallet: ₹$walletBefore" -ForegroundColor Cyan
        Write-Host "   Token: $($token.Substring(0, 15))***" -ForegroundColor Gray
    } else {
        Write-Host "❌ FAILED - Status: $($loginResp.StatusCode)" -ForegroundColor Red
        Write-Host "   Error: $($resp.error)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
    exit 1
}

# ============== TEST 2: GET USER PROFILE ==============
Write-Host "`nTEST 2: Get User Profile (GET /user/profile)" -ForegroundColor Green
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $profileResp = Invoke-WebRequest -Uri "http://localhost:4000/api/profile" `
      -Method GET `
      -Headers $headers `
      -SkipHttpErrorCheck
    
    $profile = $profileResp.Content | ConvertFrom-Json
    
    if ($profileResp.StatusCode -eq 200) {
        Write-Host "✅ SUCCESS" -ForegroundColor Green
        Write-Host "   ID: $($profile.id)" -ForegroundColor Green
        Write-Host "   Name: $($profile.name)" -ForegroundColor Green
        Write-Host "   Phone: $($profile.phone)" -ForegroundColor Green
        Write-Host "   Wallet: ₹$($profile.walletBalance)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ FAILED - Status: $($profileResp.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}

# ============== TEST 3: PLACE BID (WALLET DEDUCTION) ==============
Write-Host "`nTEST 3: Place Bid (POST /user/bids) - Wallet Deduction" -ForegroundColor Green
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

$bidAmount = 100
$bidBody = @{
    marketId = 1
    gameType = "single_digit"
    amount = $bidAmount
    number = "7"
} | ConvertTo-Json

Write-Host "   Placing bet: ₹$bidAmount on Single Digit (number 7)" -ForegroundColor Yellow

try {
    $bidResp = Invoke-WebRequest -Uri "http://localhost:4000/api/user/bids" `
      -Method POST `
      -Headers $headers `
      -ContentType "application/json" `
      -Body $bidBody `
      -SkipHttpErrorCheck
    
    $bid = ($bidResp.Content | ConvertFrom-Json).bid
    
    if ($bidResp.StatusCode -eq 201) {
        Write-Host "✅ SUCCESS - Bid Placed" -ForegroundColor Green
        Write-Host "   Bid ID: $($bid.id)" -ForegroundColor Green
        Write-Host "   Status: $($bid.status)" -ForegroundColor Cyan
        Write-Host "   Amount Deducted: -₹$($bid.amount)" -ForegroundColor Red
        $bidId = $bid.id
    } else {
        Write-Host "❌ FAILED - Status: $($bidResp.StatusCode)" -ForegroundColor Red
        Write-Host "   Error: $(($bidResp.Content | ConvertFrom-Json).error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}

# ============== TEST 4: VERIFY WALLET DEDUCTION ==============
Write-Host "`nTEST 4: Verify Wallet Deduction" -ForegroundColor Green
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

# Check user profile again to verify wallet was deducted
try {
    $profileResp2 = Invoke-WebRequest -Uri "http://localhost:4000/api/profile" `
      -Method GET `
      -Headers $headers `
      -SkipHttpErrorCheck
    
    $profile2 = $profileResp2.Content | ConvertFrom-Json
    $walletAfter = $profile2.walletBalance
    $deducted = $walletBefore - $walletAfter
    
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "   Before Bid: ₹$walletBefore" -ForegroundColor Cyan
    Write-Host "   After Bid:  ₹$walletAfter" -ForegroundColor Cyan
    Write-Host "   Deducted:   -₹$deducted" -ForegroundColor Red
    
    if ($deducted -eq $bidAmount) {
        Write-Host "   ✓ Deduction CORRECT" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Deduction INCORRECT (Expected -₹$bidAmount, got -₹$deducted)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}

# ============== TEST 5: GET USER BIDS ==============
Write-Host "`nTEST 5: Get User Bid History (GET /user/bids)" -ForegroundColor Green
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

try {
    $bidsResp = Invoke-WebRequest -Uri "http://localhost:4000/api/user/bids?page=1&limit=10" `
      -Method GET `
      -Headers $headers `
      -SkipHttpErrorCheck
    
    $bidsData = $bidsResp.Content | ConvertFrom-Json
    
    if ($bidsResp.StatusCode -eq 200) {
        Write-Host "✅ SUCCESS" -ForegroundColor Green
        Write-Host "   Total Bids: $($bidsData.total)" -ForegroundColor Green
        Write-Host "   Recent Bids:" -ForegroundColor Green
        
        $bidsData.bids | Select-Object -First 3 | ForEach-Object {
            Write-Host "   ├─ #$($_.id) | $($_.marketName) | $($_.gameType)" -ForegroundColor Gray
            Write-Host "      Amount: ₹$($_.amount) | Number: $($_.number) | Status: $($_.status)" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ FAILED - Status: $($bidsResp.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}

# ============== TEST 6: ADMIN LOGIN & DECLARE RESULT ==============
Write-Host "`nTEST 6: Declare Result (POST /results) - Auto Process Bids" -ForegroundColor Green
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

$adminLoginBody = @{
    email = "admin@matka.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $adminLoginResp = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login" `
      -Method POST `
      -ContentType "application/json" `
      -Body $adminLoginBody `
      -SkipHttpErrorCheck
    
    $adminResp = $adminLoginResp.Content | ConvertFrom-Json
    
    if ($adminLoginResp.StatusCode -eq 200) {
        $adminToken = $adminResp.token
        Write-Host "   ✓ Admin logged in" -ForegroundColor Green
        
        $adminHeaders = @{
            "Authorization" = "Bearer $adminToken"
        }
        
        # Declare result that matches the bid
        # Bid was for single_digit = 7
        # Single digit = last digit of (open + close)
        # So open=123 (3) + close=454 (4) = 7 ✓
        $resultBody = @{
            marketId = 1
            resultDate = (Get-Date).ToString("yyyy-MM-dd")
            openResult = "123"
            closeResult = "454"
            jodiResult = "37"
            pannaResult = ""
        } | ConvertTo-Json
        
        Write-Host "   Declaring result: Open=123, Close=454 (single digit = 7)" -ForegroundColor Yellow
        
        $resultResp = Invoke-WebRequest -Uri "http://localhost:4000/api/results" `
          -Method POST `
          -Headers $adminHeaders `
          -ContentType "application/json" `
          -Body $resultBody `
          -SkipHttpErrorCheck
        
        if ($resultResp.StatusCode -eq 201) {
            $result = $resultResp.Content | ConvertFrom-Json
            Write-Host "✅ SUCCESS - Result Declared" -ForegroundColor Green
            Write-Host "   Market: $($result.marketName)" -ForegroundColor Green
            Write-Host "   Open: $($result.openResult) | Close: $($result.closeResult)" -ForegroundColor Cyan
            Write-Host "   Jodi: $($result.jodiResult)" -ForegroundColor Cyan
        } else {
            Write-Host "❌ FAILED - Status: $($resultResp.StatusCode)" -ForegroundColor Red
            Write-Host "   Error: $(($resultResp.Content | ConvertFrom-Json).error)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Admin login failed - Status: $($adminLoginResp.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}

# Wait for bid processing
Start-Sleep -Seconds 2

# ============== TEST 7: FINAL BID STATUS & WALLET ==============
Write-Host "`nTEST 7: Final Bid Status & Wallet (Win/Loss Verification)" -ForegroundColor Green
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

try {
    # Check final bid status
    $finalBidsResp = Invoke-WebRequest -Uri "http://localhost:4000/api/user/bids?page=1&limit=10" `
      -Method GET `
      -Headers $headers `
      -SkipHttpErrorCheck
    
    $finalBidsData = $finalBidsResp.Content | ConvertFrom-Json
    
    $winningBid = $finalBidsData.bids | Where-Object { $_.number -eq "7" } | Select-Object -First 1
    
    if ($winningBid) {
        Write-Host "✅ Bid Found" -ForegroundColor Green
        Write-Host "   Bid ID: $($winningBid.id)" -ForegroundColor Green
        Write-Host "   Number: $($winningBid.number)" -ForegroundColor Green
        
        if ($winningBid.status -eq "won") {
            Write-Host "   Status: $($winningBid.status)" -ForegroundColor Green
            Write-Host "   ✓ BID WON" -ForegroundColor Green
        } elseif ($winningBid.status -eq "lost") {
            Write-Host "   Status: $($winningBid.status)" -ForegroundColor Red
            Write-Host "   ✗ BID LOST" -ForegroundColor Red
        } else {
            Write-Host "   Status: $($winningBid.status)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠ No matching bid found" -ForegroundColor Yellow
    }
    
    # Check final wallet
    $finalProfileResp = Invoke-WebRequest -Uri "http://localhost:4000/api/profile" `
      -Method GET `
      -Headers $headers `
      -SkipHttpErrorCheck
    
    $finalProfile = $finalProfileResp.Content | ConvertFrom-Json
    $walletFinal = $finalProfile.walletBalance
    $walletChange = $walletFinal - $walletBefore
    
    Write-Host "`n   Initial Wallet: ₹$walletBefore" -ForegroundColor Cyan
    Write-Host "   Final Wallet:   ₹$walletFinal" -ForegroundColor Cyan
    
    if ($walletChange -gt 0) {
        Write-Host "   Change:         +₹$walletChange" -ForegroundColor Green
        Write-Host "   ✓ WINNINGS CREDITED" -ForegroundColor Green
    } elseif ($walletChange -eq 0) {
        Write-Host "   Change:         ₹0" -ForegroundColor Yellow
        Write-Host "   ✗ NO CHANGE (Bid Lost)" -ForegroundColor Yellow
    } else {
        Write-Host "   Change:         ₹$walletChange" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}

# ============== SUMMARY ==============
Write-Host "`n" -NoNewline
Write-Host "==========================================`n" -ForegroundColor Cyan
Write-Host "  ✅ API TEST SUITE COMPLETED  `n" -ForegroundColor Green
Write-Host "==========================================`n" -ForegroundColor Cyan
