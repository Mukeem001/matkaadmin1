# 🔧 Hostinger Cloud - Fix Unsupported Framework Error

## Problem Kya Tha?
Hostinger root `package.json` dekh raha tha jo monorepo setup tha aur samaj nahi aa gaya ki actual API server kahan hai!

## ✅ Solution

### Step 1: Hostinger Dashboard Settings Update

**Go to:** Hostinger Cloud Dashboard → Your App Settings

Update these fields:

```
Application Root: artifacts/api-server
Build Command:    npm install && npm run build  
Start Command:    npm start
Runtime:          Node.js 20 (or latest)
Health Check:     /health (optional)
```

### Step 2: Environment Variables Set Karo

```
Database:
  DATABASE_URL=postgresql://user:password@host:5432/db_name

Server:
  PORT=3000
  NODE_ENV=production

Frontend:
  FRONTEND_URL=https://your-temporary-domain.hostinger.com

Security:
  JWT_SECRET=your-super-secret-key-here
```

### Step 3: Root Package.json Updated

Root `package.json` में ab ye scripts add kar diye hain:
- `npm run build` → ab `artifacts/api-server` build karega
- `npm start` → ab API server start karega

### Step 4: Deploy!

1. Go back to Hostinger Dashboard
2. Click "Save" and "Deploy"
3. Hostinger ab:
   - Repo se pull karega
   - Root directory se `npm install && npm run build` chalayega... 
   - Jab `build` command chalega, ye `artifacts/api-server` folder mein jaega
   - Phir `npm start` chalayega jo API server start karega

---

## Agar Problem Phir Bhi Aaye

**Option 1: Manual Deployment (Recommended)**
```bash
# Local mein push karne ke baad
# Hostinger par SSH connect karo
cd artifacts/api-server
npm install
npm run build
npm start
```

**Option 2: GitHub Actions**
Create `.github/workflows/deploy.yml` to automatically deploy na pull request. (If needed, let me know!)

---

## Quick Checklist
- [ ] `Application Root` set to `artifacts/api-server` ✓
- [ ] `Build Command` is correct ✓
- [ ] `Start Command` is correct ✓
- [ ] All environment variables added ✓
- [ ] Root `package.json` updated ✓
- [ ] Click Deploy in Hostinger ✓

**Ab sab kuch set hai! 🚀**
