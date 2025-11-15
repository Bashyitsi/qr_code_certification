#!/bin/bash

# Kigali Deutsch Academy - GitHub & Vercel Deployment Script
# This script helps you deploy to GitHub and Vercel

set -e

echo "🚀 Kigali Deutsch Academy - Deployment Setup"
echo "=============================================="
echo ""

# Check if GitHub username is provided
if [ -z "$1" ]; then
    echo "❌ Error: GitHub username not provided"
    echo ""
    echo "Usage: ./deploy.sh YOUR_GITHUB_USERNAME"
    echo ""
    echo "Example: ./deploy.sh john-doe"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_URL="https://github.com/$GITHUB_USERNAME/qr_code_certification.git"

echo "📋 Deployment Configuration:"
echo "   GitHub Username: $GITHUB_USERNAME"
echo "   Repository URL: $REPO_URL"
echo ""

# Step 1: Check if git remote exists
echo "✓ Step 1: Configuring Git Remote..."
if git remote | grep -q origin; then
    echo "  ✓ Git remote 'origin' already configured"
else
    git remote add origin "$REPO_URL"
    echo "  ✓ Added GitHub remote: origin"
fi

# Step 2: Ensure on main branch
echo ""
echo "✓ Step 2: Preparing Main Branch..."
git branch -M main
echo "  ✓ Branch renamed/confirmed as 'main'"

# Step 3: Push to GitHub
echo ""
echo "✓ Step 3: Pushing to GitHub..."
echo "  (This may prompt for authentication)"
git push -u origin main
echo "  ✓ Code pushed to GitHub!"

# Step 4: Display next steps
echo ""
echo "✅ GitHub Push Complete!"
echo ""
echo "📝 Next Steps for Vercel Deployment:"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Click: Add New → Project"
echo "3. Click: Import Git Repository"
echo "4. Enter: https://github.com/$GITHUB_USERNAME/qr_code_certification"
echo "5. Click: Import"
echo ""
echo "6. Add Environment Variables:"
echo "   - NEXTAUTH_URL=https://your-app.vercel.app"
echo "   - NEXTAUTH_SECRET=(generate with: openssl rand -base64 32)"
echo "   - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
echo "   - SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
echo ""
echo "7. Click: Deploy!"
echo ""
echo "📚 For detailed instructions, see: DEPLOYMENT.md"
echo ""
echo "🎉 Happy deploying!"
