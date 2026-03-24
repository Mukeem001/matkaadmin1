#!/bin/bash
# Hostinger Deployment Script
# ye script workspace dependencies ko resolve karega aur API server ko deploy karega

set -e

echo "🚀 Starting Hostinger Deployment..."

# Step 1: Build dependency packages first
echo "📦 Building workspace dependencies..."
cd lib/api-zod && npm install && npm run build && cd ../..
cd lib/db && npm install && npm run build && cd ../..

# Step 2: Move built dependencies to API server
echo "📤 Moving built dependencies..."
mkdir -p artifacts/api-server/node_modules/@workspace
cp -r lib/api-zod/dist artifacts/api-server/node_modules/@workspace/api-zod 2>/dev/null || true
cp -r lib/db/dist artifacts/api-server/node_modules/@workspace/db 2>/dev/null || true

# Step 3: Install and build API server
echo "🔨 Building API Server..."
cd artifacts/api-server
npm install
npm run build
cd ../..

echo "✅ Deployment ready! API server is in artifacts/api-server/dist"
