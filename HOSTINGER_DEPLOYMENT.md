# Hostinger Cloud Hosting - Deployment Guide

## API Server Deployment

### Prerequisites
- Hostinger Cloud Hosting Account
- Node.js 20+ (check your Hostinger plan)
- npm/yarn package manager
- PostgreSQL Database (or use Hostinger's managed DB)

---

## Step 1: Build the Project Locally

```bash
# Navigate to workspace root
cd path/to/project

# Install dependencies for API server
cd artifacts/api-server
npm install

# Build the API server
npm run build
```

This creates a `dist` folder with compiled files.

---

## Step 2: Prepare Environment Variables

Create a `.env` file in `artifacts/api-server/` root:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database_name

# Port (Hostinger will assign this)
PORT=3000

# Frontend URLs (for CORS)
FRONTEND_URL=https://your-temporary-domain.hostinger.com
FRONTEND_URL_WWW=https://www.your-temporary-domain.hostinger.com

# JWT Secret (for authentication)
JWT_SECRET=your-secret-key-here

# Node Environment
NODE_ENV=production
```

⚠️ **Important**: 
- Never commit `.env` file to git
- Add `.env` to `.gitignore`
- Set these variables in Hostinger's environment variables panel

---

## Step 3: Upload to Hostinger

### Option A: Using Git (Recommended)
1. Push code to GitHub/GitLab
2. In Hostinger Cloud dashboard → Connect Git Repository
3. Branch: `main` (or your production branch)
4. Build Command: `cd artifacts/api-server && npm install && npm run build`
5. Start Command: `cd artifacts/api-server && npm start`
6. Root Directory: `artifacts/api-server`

### Option B: Manual Upload (SFTP)
1. Download FileZilla or WinSCP
2. Connect using Hostinger SFTP credentials
3. Upload files from `artifacts/api-server/` to server
4. Install dependencies: `npm install --production`

---

## Step 4: Configure on Hostinger Cloud

1. **Go to Hostinger Cloud Dashboard**
2. **Create/Select Node.js Application**
3. **Set Environment Variables**:
   - `PORT`: (auto-set by Hostinger, usually 3000)
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `FRONTEND_URL`: Your frontend domain
   - `JWT_SECRET`: Your secret key
   - `NODE_ENV`: `production`

4. **Build Configuration**:
   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

5. **Health Check** (Optional):
   - Path: `/health`
   - Interval: 30 seconds

---

## Step 5: Database Setup

If using PostgreSQL on Hostinger:
1. Create database in Hostinger DBaaS
2. Run migrations:
   ```bash
   # From project root
   cd lib/db
   npm run migrate
   ```
3. Update `DATABASE_URL` in environment variables

---

## Step 6: Deploy!

1. Push changes to your git repository
2. Hostinger will automatically build and deploy
3. Check logs in Hostinger Dashboard
4. Test API: `https://your-domain/health` or `https://your-domain/api/v1/...`

---

## Troubleshooting

### Server won't start
```bash
# Check logs in Hostinger dashboard
# Common issues:
# - Missing DATABASE_URL
# - PORT conflict
# - Missing environment variables
```

### Database connection errors
```bash
# Verify DATABASE_URL format:
postgresql://username:password@host:5432/dbname
```

### CORS errors
- Update `FRONTEND_URL` environment variable
- Ensure frontend domain matches

### Port binding issues
- Don't hardcode port, use `process.env.PORT`
- Current setup already handles this ✓

---

## Post-Deployment

1. ✅ Test all API endpoints
2. ✅ Check database connectivity
3. ✅ Monitor logs for errors
4. ✅ Set up SSL certificate (usually auto on Hostinger)
5. ✅ Configure domain DNS

---

## Useful Commands

```bash
# Local testing before deployment
npm run dev

# Build
npm run build

# Start production
npm start

# Type checking
npm run typecheck
```

---

## Support Files

Need these files ready for deployment:
- ✅ `package.json` - Dependencies
- ✅ `src/index.ts` - Entry point
- ✅ `build.ts` - Build script
- ✅ `.env` - Environment variables (not committed)
- ✅ `tsconfig.json` - TypeScript config

Good luck! 🚀
