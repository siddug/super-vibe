#!/bin/bash

echo "🚀 Remote-Vibe Setup Verification"
echo "=================================="

# Check dependencies
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ Node modules installed"
else
    echo "❌ Node modules missing - run npm install"
    exit 1
fi

if [ -d "discord/node_modules" ]; then
    echo "✅ Discord package dependencies installed"
else
    echo "❌ Discord package dependencies missing"
    exit 1
fi

# Check TypeScript compilation
echo "🔍 Checking TypeScript compilation..."
cd discord
if npx tsc --noEmit > /dev/null 2>&1; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi
cd ..

# Check key files
echo "📁 Checking configuration files..."
if [ -f "opencode.json" ]; then
    echo "✅ opencode.json exists: $(cat opencode.json)"
else
    echo "❌ opencode.json missing"
fi

if grep -q '"name": "remote-vibe"' discord/package.json; then
    echo "✅ Package rebranded to remote-vibe"
else
    echo "❌ Package not properly rebranded"
fi

echo ""
echo "🎉 Setup verification complete!"
echo ""
echo "🧪 To run the bot:"
echo "   cd apps/remote-vibe"
echo "   npm run dev"
echo ""
echo "🔑 Setup will ask for:"
echo "   • Discord Application ID"
echo "   • Bot Token"
echo "   • Gemini API Key (optional)"
echo "   • Mistral API Key (optional)"
echo ""
echo "📖 For testing instructions, see the response in Discord!"