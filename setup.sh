#!/bin/bash

# Notion MCP - Quick Setup Script
# This script helps you set up your Notion integration

set -e

echo "🚀 Notion MCP Setup Script"
echo "=========================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local file already exists"
else
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ .env.local created"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Create a Notion Integration:"
echo "   → Open: https://www.notion.so/my-integrations"
echo "   → Click '+ New integration'"
echo "   → Name it (e.g., 'Notion MCP')"
echo "   → Select 'Public integration'"
echo "   → Enable: Read, Update, Insert content"
echo "   → Click 'Submit'"
echo ""
echo "2. Configure OAuth:"
echo "   → Go to 'Distribution' tab"
echo "   → Add redirect URI: http://localhost:3000/api/notion/callback"
echo "   → Copy your OAuth Client ID and Client Secret"
echo ""
echo "3. Add your credentials to .env.local:"
echo "   → NOTION_CLIENT_ID=your_client_id"
echo "   → NOTION_CLIENT_SECRET=your_client_secret"
echo ""
echo "4. Run the app:"
echo "   → npm install (if you haven't already)"
echo "   → npm run dev"
echo ""
echo "5. Connect to Notion:"
echo "   → Open: http://localhost:3000/notion/sprint-dashboard"
echo "   → Click 'Connect to Notion'"
echo "   → Authorize the app"
echo ""
echo "6. Share databases with your integration in Notion"
echo ""
echo "📖 For detailed instructions, see: SETUP_GUIDE.md"
echo ""

# Offer to open .env.local
read -p "Do you want to open .env.local now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v nano &> /dev/null; then
        nano .env.local
    elif command -v vim &> /dev/null; then
        vim .env.local
    elif command -v code &> /dev/null; then
        code .env.local
    else
        echo "Please open .env.local in your preferred editor"
    fi
fi

echo ""
echo "✨ Setup script completed!"
echo "Next: Fill in your Notion credentials in .env.local and run 'npm run dev'"
