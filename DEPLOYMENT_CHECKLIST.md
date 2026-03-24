# 📋 Deployment Checklist

## Before Deployment

### Code Quality
- [ ] No TypeScript errors: `npm run typecheck` in both admin-panel and api-server
- [ ] No console errors in local dev
- [ ] All tests passing (if tests exist)
- [ ] No sensitive data in code (API keys, passwords)
- [ ] `.env` files are in `.gitignore`

### Configuration Files
- [ ] `.env.production` in admin-panel with correct API URL
- [ ] `.env` in api-server with DATABASE_URL (not committed to git)
- [ ] All environment variables documented

### Build Verification
- [ ] Admin panel builds successfully: `npm run build`
- [ ] Build output in `dist/public/` contains index.html
- [ ] API server builds successfully: `npm run build`
- [ ] Build output in `dist/index.mjs` exists

---

## Hostinger Admin Panel Deployment

### Pre-Upload
- [ ] Hostinger account is active
- [ ] FTP/File Manager access is working
- [ ] Domain https://matka-admin.hostinger.in is set up
- [ ] SSL certificate is active (usually auto on Hostinger)

### Upload Files
- [ ] Build admin panel: `npm run build`
- [ ] Navigate to `artifacts/admin-panel/dist/public/`
- [ ] Upload ALL files to `public_html/`:
  - [ ] index.html
  - [ ] assets/ folder
  - [ ] favicon.ico
  - [ ] All other files
- [ ] Files uploaded with correct permissions (644)

### Post-Upload
- [ ] Visit https://matka-admin.hostinger.in
- [ ] Page loads (not blank)
- [ ] Browser console has no 404 errors
- [ ] Check Network tab - no 404 on JS files
- [ ] Add `.htaccess` for SPA routing if needed

---

## Render API Server Deployment

### GitHub Preparation
- [ ] Latest code pushed to GitHub
- [ ] All commits have meaningful messages
- [ ] No uncommitted changes: `git status` shows clean

### Render Setup
- [ ] Render account created and logged in
- [ ] GitHub connected to Render
- [ ] New Web Service created
- [ ] GitHub repository selected
- [ ] Build and start commands set:
  - [ ] Build: `npm install && npm run build`
  - [ ] Start: `npm run start`

### Environment Variables on Render
- [ ] `DATABASE_URL`: Full PostgreSQL connection string
- [ ] `PORT`: 4000
- [ ] `NODE_ENV`: production
- [ ] `APP_URL`: https://matka-api-server.onrender.com
- [ ] `FRONTEND_URL`: https://matka-admin.hostinger.in
- [ ] `FRONTEND_URL_WWW`: https://www.matka-admin.hostinger.in

### Deployment
- [ ] Service deployed successfully
- [ ] Build completed without errors (check logs)
- [ ] Service is running (not crashed)
- [ ] Render provides public URL
- [ ] Health check endpoint responds: `/api/health`

---

## Connection Verification

### Test Admin Panel Locally (Before Upload)
```bash
# In admin-panel folder:
VITE_API_BASE_URL=https://matka-api-server.onrender.com/api npm run dev

# Open browser and check:
# 1. Panel loads without errors
# 2. Try login
# 3. Check Network tab for API calls
# 4. Should see requests to https://matka-api-server.onrender.com/api/auth/login
```

### Test API Server Health
```bash
# Should return 200 OK:
curl https://matka-api-server.onrender.com/api/health

# Response should be:
# {"status":"ok"}
```

### Test Admin Panel After Upload
- [ ] Go to https://matka-admin.hostinger.in
- [ ] Open DevTools (F12)
- [ ] Go to Network tab
- [ ] Perform a login action
- [ ] Check that requests are sent to:
  - [ ] https://matka-api-server.onrender.com/api/auth/login (or similar)
- [ ] Check response status is 200 (not 403/CORS error)
- [ ] Check that no CORS errors appear in Console

---

## Troubleshooting During Testing

### Admin Panel Issues
- [ ] Panel is blank?
  - [ ] Check if index.html exists in Hostinger
  - [ ] Check Network tab for 404 on JS files
  - [ ] Add .htaccess for SPA routing

- [ ] CORS errors in console?
  - [ ] Verify FRONTEND_URL on Render is correct
  - [ ] Check that www version also in CORS allowed list
  - [ ] Try accessing from incognito/private browser

- [ ] API calls failing?
  - [ ] Check VITE_API_BASE_URL in admin panel .env
  - [ ] Verify Render API is running
  - [ ] Check Render logs for errors

### API Server Issues
- [ ] Service won't start?
  - [ ] Check build logs in Render dashboard
  - [ ] Verify npm dependencies are installed
  - [ ] Check build script syntax

- [ ] Database connection failing?
  - [ ] Verify DATABASE_URL is correct
  - [ ] Check database exists on Render
  - [ ] Test connection manually

- [ ] Not responding to requests?
  - [ ] Check if API is actually running (logs)
  - [ ] Verify CORS is configured for your domain
  - [ ] Try accessing /api/health endpoint

---

## Performance & Security Checks

### Performance
- [ ] Admin panel loads in < 3 seconds
- [ ] API responses come back in < 1 second
- [ ] No large unoptimized assets in admin panel
- [ ] JavaScript is minified (check in Network tab)

### Security
- [ ] No console errors about mixed content (HTTP/HTTPS)
- [ ] SSL certificate is valid for both domains
- [ ] API uses appropriate authentication (JWT tokens)
- [ ] Sensitive data not exposed in Network requests
- [ ] CORS headers are restrictive (not `*`)

---

## Post-Deployment

### Monitoring
- [ ] Set up error logging/monitoring (optional)
- [ ] Note Render free tier limitations:
  - [ ] Sleeps after 15 min inactivity (cold start delay)
  - [ ] 0.5GB RAM limit
  - [ ] Restart once per month

### Maintenance
- [ ] Document deployment URLs
- [ ] Create backup of database
- [ ] Test backup restoration procedure
- [ ] Set up automated backups if possible

### Updates
- [ ] For admin panel updates: rebuild and re-upload to Hostinger
- [ ] For API updates: commit, push to GitHub, Render auto-deploys
- [ ] Keep dependencies updated regularly

---

## Success Criteria ✅

Deployment is successful when:
- ✅ Admin panel is accessible at https://matka-admin.hostinger.in
- ✅ No errors in browser console or Network tab
- ✅ API server is accessible at https://matka-api-server.onrender.com
- ✅ Health endpoint returns 200: `/api/health`
- ✅ Login works end-to-end (admin panel → API server)
- ✅ Data flows correctly (read/write operations work)
- ✅ No CORS or connection errors

---

## Common Issues & Solutions

| Issue | Check | Solution |
|-------|-------|----------|
| Admin panel blank | index.html in Hostinger | Re-upload dist/public/* |
| CORS errors | FRONTEND_URL on Render | Add both www and non-www versions |
| 404 on JS files | Network tab | Check assets/ folder uploaded |
| API not responding | Render logs | Check build/start commands |
| Database errors | DATABASE_URL format | Verify connection string |
| Login fails | Console errors | Check both frontend and backend logs |

---

## Rollback Plan

If something goes wrong:

### Admin Panel Rollback
```bash
# Revert to previous version in Hostinger:
1. Keep backup of old files
2. Re-upload previous dist/public/* contents
```

### API Server Rollback
```bash
# On GitHub:
git revert <commit-hash>
git push origin main
# Render auto-deploys previous version
```

---

**Last Updated**: March 24, 2026
**Status**: Ready for Deployment ✅

