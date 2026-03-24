# ⚠️ ERROR FIX: "Unsupported Framework or Invalid Project Structure"

## Problem Analysis

Hostinger ne dekha ki:
- Root `package.json` mein `workspaces` declaration hai
- Ye monorepo setup Hostinger supported nahi karta initially
- API server ko `@workspace/api-zod` aur `@workspace/db` dependencies chahiye jo workspaces mein hain

---

## ✅ Solution: 3 Approaches

### **Approach 1: Manual Full Upload (Recommended for Now)**

Agar Hostinger builder issue de raha hai, toh direct SFTP se upload kar do:

1. **Local build kar lo:**
   ```bash
   cd artifacts/api-server
   npm install
   npm run build
   ```

2. **SFTP connect karo (Hostinger credentials use kar ke)**
   ```bash
   # Terminal mein
   sftp username@hostinger-server.com
   cd public_html  # or your app directory
   put -r node_modules/
   put -r dist/
   put .env
   put package.json
   ```

3. **Hostinger SSH connection:**
   ```bash
   ssh username@hostinger-server.com
   cd public_html
   npm start
   # ya pm2 se run kar sakte ho
   pm2 start "npm start" --name "matka-api"
   ```

---

### **Approach 2: Use Proc File (Recommended)**

Create `Procfile` in repository root ko Hostinger samjhe:

```yaml
web: cd artifacts/api-server && npm install && npm run build && npm start
```

---

### **Approach 3: Deploy from artifacts/api-server only**

**New GitHub Repo banao specifically deployment ke liye:**

1. Create new branch:
   ```bash
   git checkout -b hostinger-deploy
   ```

2. Copy only API server:
   ```bash
   cp artifacts/api-server/* . -r
   cp lib/api-zod lib/db . -r  # This might need adjustment
   ```

3. Update root `package.json` to be simple:
   ```json
   {
     "name": "matka-api-server",
     "version": "0.0.0",
     "type": "module",
     "scripts": {
       "dev": "cross-env NODE_ENV=development tsx ./src/index.ts",
       "build": "tsx ./build.ts",
       "start": "node dist/index.js",
       "typecheck": "tsc -p tsconfig.json --noEmit"
     },
     "dependencies": { ... }
   }
   ```

4. Push to GitHub
5. In Hostinger, select this branch

---

## 🔧 What Changed

1. ✅ Added `engines` field to root `package.json` (Node 18+)
2. ✅ Created `hostinger-deploy.sh` aur `.bat` scripts
3. ✅ These scripts workspace dependencies ko build karenge aur API server ko package karengi

---

## 🎯 Immediate Action

**IF HOSTINGER STILL COMPLAIN KARE:**

Try ek aur baar: Repository selection ke screen par,  **"matkaadmin1" select karke** -> Settings icon -> Change karo:

```
Build Command:    npm run build
Start Command:    npm start  
Root Directory:   artifacts/api-server (see if this field exists)
```

Agar ye field na dikhe, toh manual deployment (Approach 1) hi use kar.

---

## 📝 Hostinger Supported Frameworks

Hostinger officially supports:
- ✅ Express.js (which we use)
- ✅ Next.js
- ✅ Nuxt.js
- ✅ Nest.js
- ⚠️ Monorepos (conditional support)

**Humara Express.js app ✓ supported hai, lekin monorepo structure confusion kar raha hai**

---

## Next Steps

1. Push latest code: `git add . && git commit && git push`
2. Try Hostinger dashboard mein deploy fir se
3. Agar error aaye, toh manual SFTP deployment (Approach 1) use karo
4. Once working, PhantomJS/Selenium se automated tests setup kar sakte ho

---

**Need help with next step?** Let me know! 💬
