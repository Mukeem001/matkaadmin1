# 🚀 Deployment Setup Guide

## Current Configuration
- **Admin Panel**: React + Vite (will deploy to Hostinger)
- **API Server**: Express.js (will deploy to Render)
- **Database**: PostgreSQL on Render (already configured)
- **Domain**: matka-admin.hostinger.in (Hostinger)

---

## 📋 Pre-Deployment Checklist

### Admin Panel (Hostinger)
- [ ] Latest code pushed to GitHub
- [ ] Build files generated: `npm run build` in admin-panel
- [ ] `.env.production` has correct API URL: `https://matka-api-server.onrender.com/api`
- [ ] No console errors in build output

### API Server (Render)
- [ ] Latest code pushed to GitHub
- [ ] All environment variables configured on Render
- [ ] Database URL is correct and tested
- [ ] Health check endpoint working: `/api/health`

---

## 🎯 Step-by-Step Deployment

### STEP 1: Build Admin Panel

```bash
cd artifacts/admin-panel
npm install
npm run build
```

**Expected output:**
- ✅ Builds without errors
- ✅ Creates `dist/public/` folder with HTML, CSS, JS files
- ✅ Index.html is in dist/public/

**Verify:**
```bash
ls -la dist/public/
# Should show: index.html, assets/, favicon.ico, etc.
```

---

### STEP 2: Upload to Hostinger

#### Via Hostinger File Manager:
1. Login to Hostinger Control Panel
2. Go to **File Manager**
3. Navigate to **public_html** folder
4. Delete old files (keep .htaccess if exists)
5. Upload all files from `dist/public/`:
   - index.html
   - assets/ folder
   - favicon.ico
   - (all other files)

#### Via FTP (Alternative):
```bash
# Using FTP client like FileZilla:
# Host: ftp.yourdomain.com
# Username: your-ftp-user
# Password: your-ftp-password
# 
# Upload dist/public/* to /public_html/
```

**Verify Upload:**
- Go to https://matka-admin.hostinger.in
- You should see the admin panel loading

---

### STEP 3: Deploy API Server to Render

#### Option A: Using Render Dashboard (Recommended)

1. **Connect GitHub Repository**
   - Go to https://render.com
   - Click "New" → "Web Service"
   - Select your GitHub repository
   - Connect it

2. **Configure Service**
   - **Name**: `matka-api-server`
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free (or Starter if you need reliability)

3. **Add Environment Variables**
   - Click "Environment" tab
   - Add these variables:
   ```
   DATABASE_URL=postgresql://matka_kt14_user:mM49WUxTZ4XunlcsvJfyCLPfJT4iMKzY@dpg-d6r14l94tr6s7381lo4g-a.oregon-postgres.render.com/matka_kt14?sslmode=require
   PORT=4000
   NODE_ENV=production
   APP_URL=https://matka-api-server.onrender.com
   FRONTEND_URL=https://matka-admin.hostinger.in
   FRONTEND_URL_WWW=https://www.matka-admin.hostinger.in
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Check logs for errors

#### Option B: Using Render YAML (Advanced)
```bash
# Use the render-api-server.yaml file
# Already created in project root
```

---

### STEP 4: Verify Connections

#### Test Admin Panel
```bash
# In browser console (DevTools F12):
1. Open Network tab
2. Login to admin panel
3. Check API requests go to: https://matka-api-server.onrender.com/api/*
4. Verify response codes are 200/201/401 (not CORS errors)
```

#### Test API Server
```bash
# Check health endpoint:
curl https://matka-api-server.onrender.com/api/health

# Should return:
# {"status": "ok"}
```

#### Test Full Connection
```bash
# Try login from admin panel
# Monitor Network tab for:
# POST https://matka-api-server.onrender.com/api/auth/login
# Should return: 200 with auth token
```

---

## 🆘 Troubleshooting

### Admin Panel Blank/Not Loading
**Symptom**: White page, no content

**Solutions:**
```bash
# 1. Check if files uploaded correctly
# - Verify index.html exists in public_html/
# - Verify assets/ folder exists

# 2. Check browser console (F12)
# - Look for 404 errors on JS files
# - Look for CORS errors

# 3. Check Hostinger .htaccess
# Add to public_html/.htaccess for SPA routing:
```
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### API Server Not Responding
**Symptom**: CORS errors, 404 responses, connection refused

**Solutions:**
```bash
# 1. Check Render logs
# - Go to Render dashboard
# - Click your service
# - Check "Logs" tab for errors

# 2. Verify environment variables
# - Check DATABASE_URL is correct
# - Check FRONTEND_URL is set

# 3. Restart service
# - Render dashboard → Manual deploy
```

### CORS Errors
**Symptom**: "Access to XMLHttpRequest blocked by CORS policy"

**Solutions:**
```bash
# 1. Verify FRONTEND_URL on Render matches your Hostinger domain
# 2. Check app.ts CORS configuration:
# - allowedOrigins should include your Hostinger domain
# - Should also include www version

# 3. Clear browser cache
# - Ctrl+Shift+Delete → Clear all
```

### Database Connection Failed
**Symptom**: Database query errors, can't login

**Solutions:**
```bash
# 1. Verify DATABASE_URL:
DATABASE_URL=postgresql://[user]:[pass]@[host]/[db]?sslmode=require

# 2. Test connection manually:
psql "postgresql://user:pass@host/db?sslmode=require"

# 3. Check database exists on render.com
# - Account → Databases check
```

---

## 📊 Expected Final URLs

After deployment, you should have:

| Service | URL | Type |
|---------|-----|------|
| Admin Panel | https://matka-admin.hostinger.in | Frontend |
| API Server | https://matka-api-server.onrender.com | Backend |
| API Health | https://matka-api-server.onrender.com/api/health | Health Check |
| Auth Endpoint | https://matka-api-server.onrender.com/api/auth/login | API |

---

## 🔄 Making Updates After Deployment

### Update Admin Panel
```bash
cd artifacts/admin-panel
npm run build
# Upload dist/public/* to Hostinger again
```

### Update API Server
```bash
git add -A
git commit -m "Update: description of changes"
git push origin main
# Render auto-deploys on push
```

---

## 📝 Important Notes

1. **Environment Variables**: Never commit `.env` files to git
2. **Build Files**: Only upload `dist/public/*` to Hostinger, not entire project
3. **API Error Logs**: Check Render logs for debugging
4. **Database**: Backup before major changes
5. **CORS**: Ensure both domains (with and without www) are allowed
6. **SSL**: Both services use HTTPS by default

---

## ⚡ Quick Command Reference

```bash
# Build admin panel
cd artifacts/admin-panel && npm run build

# Test build locally
cd artifacts/admin-panel && npm run serve

# Check API server build
cd artifacts/api-server && npm run build

# Test API locally
cd artifacts/api-server && npm run dev

# Push to GitHub (triggers Render auto-deploy)
git add -A && git commit -m "Deploy" && git push origin main
```

---

## ✅ Deployment Complete When:

- ✅ Admin panel loads at https://matka-admin.hostinger.in
- ✅ Admin panel console shows no CORS errors
- ✅ Can login successfully
- ✅ API calls show 200 responses
- ✅ Render logs show no errors
- ✅ Admin panel can fetch data from API

**If all above are green, deployment is successful! 🎉**

