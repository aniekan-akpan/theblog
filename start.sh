#!/bin/bash

# Quick Start Script for Aniekan Blog with Strapi CMS

echo "🚀 Starting Aniekan Blog..."
echo ""

# Check if Node.js version is correct
NODE_VERSION=$(node --version)
echo "📦 Node version: $NODE_VERSION"

if [[ ! "$NODE_VERSION" =~ ^v20 ]]; then
    echo "⚠️  Warning: Node.js 20 is recommended for Strapi"
    echo "   Run 'fnm use 20' to switch to Node.js 20"
    echo ""
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    pnpm install
    echo ""
fi

if [ ! -d "cms/node_modules" ]; then
    echo "📥 Installing Strapi dependencies..."
    cd cms && npm install && cd ..
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "   Creating .env from template..."
    cat > .env << EOF
# Strapi CMS Configuration
PUBLIC_STRAPI_URL=http://localhost:1337
# Generate an API token in Strapi: Settings → API Tokens
# Leave empty for public endpoints or add token for authenticated access
STRAPI_API_TOKEN=
EOF
    echo "✅ Created .env file"
    echo ""
fi

echo "🎯 Starting services..."
echo ""
echo "Opening two terminals:"
echo "  1️⃣  Strapi CMS (http://localhost:1337/admin)"
echo "  2️⃣  Astro Blog (http://localhost:4321/aniekan-blog)"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Start both services using concurrently
pnpm dev:all
