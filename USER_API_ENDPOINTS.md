# User API Endpoints - Market Results

## Problem Fixed ✅

**Issue**: When users call the `/markets` endpoint, results were showing as `null`.

**Root Cause**: Results were being saved only in the `results` table (for historical data), but users were getting data from the `markets` table which had null results.

**Solution**: Now when live results are scraped, they are saved in BOTH:
1. `results` table (for historical tracking by date)
2. `markets` table (for current/latest results) ← Users see this

---

## User APIs for Getting Markets & Results

### 1️⃣ **Get All Markets (WITH Current Results) - Most Important**
```
GET /api/markets
```

**Response includes:**
- `name` - Market name (e.g., "KALYAN MORNING")
- `openTime` - Market open time (e.g., "09:00")
- `closeTime` - Market close time (e.g., "21:00")
- `openResult` - Latest open result (e.g., "156")
- `jodiResult` - Latest jodi result (e.g., "25")
- `closeResult` - Latest close result (e.g., "267")
- `isActive` - Is market active (true/false)
- `autoUpdate` - Auto-update enabled (true/false)
- `lastFetchedAt` - When results were last updated

**Example Response:**
```json
[
  {
    "id": 24,
    "name": "KALYAN MORNING",
    "openTime": "09:00",
    "closeTime": "12:00",
    "isActive": true,
    "openResult": "478",
    "jodiResult": "92",
    "closeResult": "480",
    "autoUpdate": false,
    "sourceUrl": "https://satkamatka.com.in/",
    "lastFetchedAt": "2026-03-17T17:31:00.000Z",
    "fetchError": null,
    "createdAt": "2026-03-01T10:30:00.000Z"
  }
]
```

**No authentication required** ✅

---

### 2️⃣ **Get Single Market With Results**
```
GET /api/markets/:id
```

**Requires**: `Authorization: Bearer {token}`

**Example:**
```
GET /api/markets/24
Authorization: Bearer eyJhbGc...
```

---

### 3️⃣ **Get Historical Results by Date** (For Reports/History)
```
GET /api/markets/:id/results/:date
```

**Parameters:**
- `:id` = Market ID
- `:date` = Date in format `yyyy-MM-dd`

**Requires**: `Authorization: Bearer {token}`

**Example:**
```
GET /api/markets/24/results/2026-03-17
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "success": true,
  "message": "Results found",
  "data": {
    "openResult": "478",
    "closeResult": "480",
    "jodiResult": "92"
  }
}
```

---

## Data Flow 🔄

```
Website (satkamatka.com.in)
    ↓
Scraper (extracts results)
    ↓
    ├→ Save to results table (historical - with date)
    ├→ Save to markets table (current - no date)
    ↓
User calls /api/markets
    ↓
Returns markets table data with LATEST results
```

---

## Testing the Fix

1. **Open Admin Panel** → Markets page
2. **Results should display** in both columns
3. **Database saves to both tables**:
   - `markets` table: Latest results (what users see)
   - `results` table: All results by date (for history)

---

## Summary

| Use Case | API Endpoint | Auth | Returns |
|----------|------|------|---------|
| Get all markets + latest results | `GET /api/markets` | ❌ No | All markets with current results |
| Get single market + results | `GET /api/markets/:id` | ✅ Yes | One market with current results |
| Get results for specific date | `GET /api/markets/:id/results/:date` | ✅ Yes | Results for that date only |

**For most users**: Use `GET /api/markets` - it has everything! ✅
