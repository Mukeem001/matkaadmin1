# Complete API Test Suite - Bid & Wallet System

Write-Host "`n" -NoNewline
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  COMPREHENSIVE API TEST SUITE" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan

# TEST 1: USER LOGIN
Write-Host "`nTEST 1: User Login (POST /auth/user/login)" -ForegroundColor Green
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

$loginBody = @{
    phone = "9999990001"
    password = "user123"
} | ConvertTo-Json

try {
    $uri1 = "http://localhost:4000/api/auth/user/login"
    $loginResp = Invoke-WebRequest -Uri $uri1 -Method POST -ContentType "application/json" -Body $loginBody -SkipHttpErrorCheck
    
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
    } else {
        Write-Host "❌ FAILED - Status: $($loginResp.StatusCode)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
    exit 1
}

# TEST 2: GET USER PROFILE
Write-Host "`nTEST 2: Get User Profile (GET /api/profile)" -ForegroundColor Green
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

$headers = @{ "Authorization" = "Bearer $token" }

try {
    $uri2 = "http://localhost:4000/api/profile"
    $profileResp = Invoke-WebRequest -Uri $uri2 -Method GET -Headers $headers -SkipHttpErrorCheck
    
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

# TEST 3: PLACE BID
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
    $uri3 = "http://localhost:4000/api/user/bids"
    $bidResp = Invoke-WebRequest -Uri $uri3 -Method POST -Headers $headers -ContentType "application/json" -Body $bidBody -SkipHttpErrorCheck
    
    $bidResp_data = $bidResp.Content | ConvertFrom-Json
    
    if ($bidResp.StatusCode -eq 201) {
        $bid = $bidResp_data.bid
        Write-Host "✅ SUCCESS - Bid Placed" -ForegroundColor Green
        Write-Host "   Bid ID: $($bid.id)" -ForegroundColor Green
        Write-Host "   Status: $($bid.status)" -ForegroundColor Cyan
        Write-Host "   Amount Deducted: -₹$($bid.amount)" -ForegroundColor Red
        $bidId = $bid.id
    } else {
        Write-Host "❌ FAILED - Status: $($bidResp.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}

# TEST 4: VERIFY WALLET DEDUCTION
Write-Host "`nTEST 4: Verify Wallet Deduction" -ForegroundColor Green
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

try {
    $uri4 = "http://localhost:4000/api/profile"
    $profileResp2 = Invoke-WebRequest -Uri $uri4 -Method GET -Headers $headers -SkipHttpErrorCheck
    
    $profile2 = $profileResp2.Content | ConvertFrom-Json
    $walletAfter = $profile2.walletBalance
    $deducted = $walletBefore - $walletAfter
    
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "   Before Bid: ₹$walletBefore" -ForegroundColor Cyan
    Write-Host "   After Bid:  ₹$walletAfter" -ForegroundColor Cyan
    Write-Host "   Deducted:   -₹$deducted" -ForegroundColor Red
    
    if ($deducted -eq $bidAmount) {
        Write-Host "   CORRECT!" -ForegroundColor Green
    } else {
        Write-Host "   INCORRECT (Expected -₹$bidAmount)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}

# TEST 5: GET USER BIDS
Write-Host "`nTEST 5: Get User Bid History (GET /user/bids)" -ForegroundColor Green
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

try {
    $uri5 = 'http://localhost:4000/api/user/bids?page=1&limit=10'
    $bidsResp = Invoke-WebRequest -Uri $uri5 -Method GET -Headers $headers -SkipHttpErrorCheck
    
    $bidsData = $bidsResp.Content | ConvertFrom-Json
    
    if ($bidsResp.StatusCode -eq 200) {
        Write-Host "✅ SUCCESS" -ForegroundColor Green
        Write-Host "   Total Bids: $($bidsData.total)" -ForegroundColor Green
        Write-Host "   Recent Bids:" -ForegroundColor Green
        
        $bidsData.bids | Select-Object -First 3 | ForEach-Object {
            $status_color = if($_.status -eq "won") { "Green" } elseif($_.status -eq "lost") { "Red" } else { "Yellow" }
            Write-Host "   ├─ Bid #$($_.id) | $($_.marketName)" -ForegroundColor Gray
            Write-Host "      Game: $($_.gameType) | Amount: ₹$($_.amount) | Number: $($_.number) | Status: " -ForegroundColor Gray -NoNewline
            Write-Host "$($_.status)" -ForegroundColor $status_color
        }
    } else {
        Write-Host "❌ FAILED - Status: $($bidsResp.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}

# TEST 6: DECLARE RESULT
Write-Host "`nTEST 6: Declare Result (POST /results)" -ForegroundColor Green
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

$adminLoginBody = @{
    email = "admin@matka.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $uri6a = "http://localhost:4000/api/auth/login"
    $adminLoginResp = Invoke-WebRequest -Uri $uri6a -Method POST -ContentType "application/json" -Body $adminLoginBody -SkipHttpErrorCheck
    
    $adminResp = $adminLoginResp.Content | ConvertFrom-Json
    
    if ($adminLoginResp.StatusCode -eq 200) {
        $adminToken = $adminResp.token
        Write-Host "   ✓ Admin logged in" -ForegroundColor Green
        
        $adminHeaders = @{ "Authorization" = "Bearer $adminToken" }
        
        $resultBody = @{
            marketId = 1
            resultDate = (Get-Date).ToString("yyyy-MM-dd")
            openResult = "123"
            closeResult = "454"
            jodiResult = "37"
            pannaResult = ""
        } | ConvertTo-Json
        
        Write-Host "   Declaring: Open=123, Close=454 (single digit = 7)" -ForegroundColor Yellow
        
        $uri6b = "http://localhost:4000/api/results"
        $resultResp = Invoke-WebRequest -Uri $uri6b -Method POST -Headers $adminHeaders -ContentType "application/json" -Body $resultBody -SkipHttpErrorCheck
        
        if ($resultResp.StatusCode -eq 201) {
            $result = $resultResp.Content | ConvertFrom-Json
            Write-Host "✅ SUCCESS - Result Declared" -ForegroundColor Green
            Write-Host "   Market: $($result.marketName)" -ForegroundColor Green
            Write-Host "   Open: $($result.openResult) | Close: $($result.closeResult)" -ForegroundColor Cyan
        } else {
            Write-Host "❌ FAILED - Status: $($resultResp.StatusCode)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Admin login failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# TEST 7: FINAL BID STATUS
Write-Host "`nTEST 7: Final Bid Status & Wallet Verification" -ForegroundColor Green
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

try {
    $uri7a = 'http://localhost:4000/api/user/bids?page=1&limit=10'
    $finalBidsResp = Invoke-WebRequest -Uri $uri7a -Method GET -Headers $headers -SkipHttpErrorCheck
    
    $finalBidsData = $finalBidsResp.Content | ConvertFrom-Json
    
    $winningBid = $finalBidsData.bids | Where-Object { $_.number -eq "7" } | Select-Object -First 1
    
    if ($winningBid) {
        Write-Host "✅ Bid Found" -ForegroundColor Green
        Write-Host "   Bid ID: $($winningBid.id)" -ForegroundColor Green
        Write-Host "   Number: $($winningBid.number)" -ForegroundColor Green
        
        $status_color = if($winningBid.status -eq "won") { "Green" } else { "Red" }
        Write-Host "   Status: $($winningBid.status)" -ForegroundColor $status_color
        
        if ($winningBid.status -eq "won") {
            Write-Host "   ✓ BID WON!" -ForegroundColor Green
        } else {
            Write-Host "   ✗ BID LOST" -ForegroundColor Red
        }
    }
    
    $uri7b = "http://localhost:4000/api/profile"
    $finalProfileResp = Invoke-WebRequest -Uri $uri7b -Method GET -Headers $headers -SkipHttpErrorCheck
    
    $finalProfile = $finalProfileResp.Content | ConvertFrom-Json
    $walletFinal = $finalProfile.walletBalance
    $walletChange = $walletFinal - $walletBefore
    
    Write-Host ""
    Write-Host "   Initial Wallet: ₹$walletBefore" -ForegroundColor Cyan
    Write-Host "   Final Wallet:   ₹$walletFinal" -ForegroundColor Cyan
    
    if ($walletChange -gt 0) {
        Write-Host "   Change:         +₹$walletChange" -ForegroundColor Green
        Write-Host "   ✓ WINNINGS CREDITED!" -ForegroundColor Green
    } elseif ($walletChange -eq 0) {
        Write-Host "   Change:         ₹0 (No change)" -ForegroundColor Yellow
        Write-Host "   (Bid status will show in history)" -ForegroundColor Yellow
    } else {
        Write-Host "   Change:         ₹$walletChange" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}

Write-Host "`n=============================================" -ForegroundColor Cyan
Write-Host "  ALL API TESTS COMPLETED" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
