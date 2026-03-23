# Deployment Guide - Matka Admin Panel

## Architecture
- **Frontend**: Admin Panel → Hostinger (Static/Vite build)
- **Backend**: API Server → Render (Node.js)
- **Database**: PostgreSQL on Render

---

## 📱 Part 1: Deploying Admin Panel to Hostinger

### Step 1: Build Production Files
```bash
cd artifacts/admin-panel
npm install
npm run build
```
This creates optimized static files in `dist/public/` folder.

### Step 2: Environment Setup for Hostinger
Create `.env.production.local` in admin-panel folder:
```
VITE_API_BASE_URL=https://matka-api-server.onrender.com
```

### Step 3: Upload to Hostinger
1. Go to Hostinger Control Panel → File Manager
2. Upload all contents of `dist/public/` to `public_html/` folder
3. Set index.html as home page (if needed)

### Step 4: Verify Admin Panel
Visit your Hostinger domain and check console for API calls to Render.

---

## 🔧 Part 2: Deploying API Server to Render

### Step 1: Prepare Git Repository
Push your api-server code to GitHub (already done):
```bash
git push origin main
```

### Step 2: Create Render Deployment
1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configuration:
   - **Name**: matka-api-server
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Environment**: Production

### Step 3: Set Environment Variables on Render
In Render Dashboard → Environment:
```
DATABASE_URL=postgresql://[user]:[pass]@[host]/[dbname]?sslmode=require
PORT=4000
NODE_ENV=production
APP_URL=https://matka-api-server.onrender.com
FRONTEND_URL=https://matka-admin.hostinger.in
FRONTEND_URL_WWW=https://www.matka-admin.hostinger.in
```

### Step 4: Enable Auto-Deploy
- Render will auto-deploy on push to main branch

---

## 🔗 Part 3: Connection Setup

### Admin Panel API Configuration
File: `artifacts/admin-panel/src/lib/auth.tsx` (or your API client)

Ensure it uses `VITE_API_BASE_URL`:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
```

### API Server CORS Headers
Already configured in `artifacts/api-server/src/app.ts`:
```typescript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_WWW,
  ...
];
```

---

## ✅ Verification Checklist

- [ ] Admin panel builds successfully: `npm run build`
- [ ] Static files uploaded to Hostinger
- [ ] API server deployed to Render
- [ ] Environment variables set on Render
- [ ] Database migration completed (if needed)
- [ ] CORS headers properly configured
- [ ] Admin panel can reach API: Check browser console for successful API calls
- [ ] Authentication works end-to-end

---

## 🚀 Quick Deployment Steps

### Build & Deploy Admin Panel
```bash
cd artifacts/admin-panel
npm install
npm run build
# Upload dist/public/* to Hostinger public_html/
```

### Deploy API Server to Render
```bash
git add -A
git commit -m "Deploy to Render"
git push origin main
# Render auto-deploys on push
```

---

## 📊 Expected URLs After Deployment

- **Admin Panel**: https://matka-admin.hostinger.in
- **API Server**: https://matka-api-server.onrender.com
- **Database**: Hosted on Render PostgreSQL

---

## 🆘 Troubleshooting

### Admin panel can't reach API
1. Check VITE_API_BASE_URL in .env
2. Verify Render API is running
3. Check CORS settings in app.ts

### Render deployment fails
1. Check build logs in Render dashboard
2. Ensure all dependencies in package.json
3. Verify DATABASE_URL format

### Static files not loading
1. Check Hostinger base path configuration
2. Verify file permissions (644 for files, 755 for folders)
3. Check if .htaccess needs rewrite rules for SPA

---

## 📝 Notes

- Keep `.env` files out of git (use `.gitignore`)
- Use `.env.example` for documentation
- Monitor Render dashboard for errors
- Set up error logging/monitoring
- Regular database backups

