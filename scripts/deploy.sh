#!/bin/bash

# Premier Deals Deployment Script
echo "🚀 Starting Premier Deals deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🏗️ Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "🚀 Ready for deployment!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "📋 Deployment checklist:"
echo "1. ✅ Dependencies installed"
echo "2. ✅ Prisma client generated"
echo "3. ✅ Application built"
echo ""
echo "🔧 Next steps:"
echo "1. Push to GitHub"
echo "2. Connect to Vercel"
echo "3. Set environment variables"
echo "4. Deploy!" 