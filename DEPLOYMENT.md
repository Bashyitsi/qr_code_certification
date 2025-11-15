# Deployment Guide - Kigali Deutsch Academy Certificate System

## Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account
- Supabase project with database setup

### Step 1: Push to GitHub

```bash
# Clone or navigate to your project
cd /Users/drich/Documents/qr_code_certification

# If not already done, add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/qr_code_certification.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Paste: `https://github.com/YOUR_USERNAME/qr_code_certification`
5. Click **Import**

### Step 3: Configure Environment Variables

In Vercel project settings, add these environment variables:

| Variable | Value | Example |
|----------|-------|---------|
| `NEXTAUTH_URL` | Your production URL | `https://certificates.yourdomain.com` |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` | (auto-generated) |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase Settings | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase Settings | (public key) |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase Settings | (private key) |

### Step 4: Deploy!

Click **"Deploy"** - Vercel will automatically build and deploy your app.

---

## Environment Variables Explained

### Authentication (`NEXTAUTH_*`)
- `NEXTAUTH_URL`: Your app's public URL (required for production)
- `NEXTAUTH_SECRET`: Random secret for session encryption
  - Generate: `openssl rand -base64 32`

### Supabase (`NEXT_PUBLIC_SUPABASE_*` & `SUPABASE_*`)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public key for client-side queries
- `SUPABASE_SERVICE_ROLE_KEY`: Private key for server-side operations (keep secret!)

### Finding Your Credentials

**Supabase:**
1. Go to Project Settings → API
2. Copy URL and Keys
3. Add to Vercel environment variables

**Vercel:**
1. Project Settings → Environment Variables
2. Add all variables from above
3. Redeploy after adding variables

---

## Post-Deployment Setup

### 1. Verify Database Connection
- Visit: `https://your-app.vercel.app/admin/login`
- Default credentials from `.env.local`
- Create a test certificate

### 2. Test QR Code Generation
- Download generated PDF
- Scan QR code with phone
- Should redirect to certificate verification page

### 3. Update Domain (if using custom domain)
```
In Vercel project settings:
1. Add custom domain
2. Update NEXTAUTH_URL to match
3. Redeploy
```

---

## Continuous Deployment

**Automatic:**
- Every push to `main` branch → Auto-deploy to Vercel
- Build logs visible in Vercel dashboard

**Manual Redeploy:**
- Vercel Dashboard → Project → Deployments → Click deploy

---

## Troubleshooting

### Logo Not Appearing in PDF
- Check: `/public/kda-logo.png` exists
- Verify: File is valid PNG format
- Check build logs in Vercel

### Database Connection Issues
- Verify Supabase credentials in Vercel env vars
- Check Supabase project is active
- Review Supabase logs for errors

### QR Code Not Scanning
- Verify QR code URL points to correct domain
- Test with multiple QR scanners
- Check certificate code in database

---

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment/vercel)
- [Supabase Docs](https://supabase.com/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)

---

## Support

For issues, check:
1. Vercel deployment logs
2. Browser console errors
3. Network tab in developer tools
4. Supabase dashboard logs
