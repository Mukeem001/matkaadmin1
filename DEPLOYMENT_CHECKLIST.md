# 🚀 Hostinger Cloud Deployment Checklist

## Pre-Deployment (Local)
- [ ] Clone/pull latest code
- [ ] Run `npm install` in `artifacts/api-server/`
- [ ] Create `.env` file (copy from `.env.example`)
- [ ] Fill in all Database and JWT variables
- [ ] Run `npm run build` - verify no errors
- [ ] Run `npm start` locally - test it works
- [ ] Check API response on `http://localhost:3000/health`

## Hostinger Setup
- [ ] Create Hostinger Cloud account
- [ ] Note down: Temporary domain, FTP credentials
- [ ] Create PostgreSQL database (or note connection string)
- [ ] Generate strong JWT_SECRET

## Deployment
- [ ] Option A (Git) - Connect GitHub repo to Hostinger
  - [ ] Push code to GitHub `main` branch
  - [ ] Connect repo in Hostinger dashboard
  - [ ] Set build command: `cd artifacts/api-server && npm install && npm run build`
  - [ ] Set start command: `cd artifacts/api-server && npm start`

OR

- [ ] Option B (Manual) - Upload via SFTP
  - [ ] Download FileZilla/WinSCP
  - [ ] Upload `artifacts/api-server/` contents
  - [ ] SSH into server: `npm install --production`
  - [ ] Run: `npm start` (or use PM2 for background)

## Environment Variables (Hostinger Dashboard)
- [ ] `DATABASE_URL` = Your PostgreSQL connection string
- [ ] `PORT` = 3000 (or Hostinger's assigned port)
- [ ] `NODE_ENV` = production
- [ ] `FRONTEND_URL` = https://your-temporary-domain.hostinger.com
- [ ] `JWT_SECRET` = Your generated secret key

## Testing Post-Deployment
- [ ] API is accessible: `https://your-domain/health`
- [ ] Database connection works
- [ ] Login endpoint responds: `/api/v1/auth/login`
- [ ] CORS headers are correct
- [ ] Check Hostinger logs for errors

## Optional: Production Optimization
- [ ] Enable caching headers
- [ ] Set up SSL (should be auto on Hostinger)
- [ ] Configure domain DNS records
- [ ] Monitor resource usage
- [ ] Set up error logging/monitoring

---

## Hostinger Temporary Domain Info
- Domain: `temperory domain use kru nga` (as mentioned)
- Wait for Hostinger to provide you with:
  - Full temporary domain URL
  - FTP/SFTP credentials
  - Database connection string

---

**Status**: Ready for deployment! ✅
**Next Step**: Sign in to Hostinger → Create Node.js app → Configure

Need help with any specific step? Just ask! 💬
