# 🚀 Vercel Deployment Guide

This guide will help you deploy Premier Deals to Vercel with all necessary configurations.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: Set up a PostgreSQL database (recommended: PlanetScale, Neon, or Supabase)
3. **Email Service**: Set up SMTP email service (Gmail, Outlook, or other SMTP provider)
4. **Cloudinary**: Set up Cloudinary account for image uploads

## 🔧 Step-by-Step Deployment

### 1. Database Setup

#### Option A: PlanetScale (Recommended)
1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get your connection string
4. Run migrations:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

#### Option B: Neon
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Get your connection string
4. Run migrations

#### Option C: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your connection string
4. Run migrations

### 2. Email Service Setup (SMTP)

#### Option A: Gmail SMTP
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use these settings:
   - SMTP_HOST: smtp.gmail.com
   - SMTP_PORT: 587
   - SMTP_USER: your-email@gmail.com
   - SMTP_PASS: your-app-password

#### Option B: Outlook/Hotmail SMTP
1. Use these settings:
   - SMTP_HOST: smtp-mail.outlook.com
   - SMTP_PORT: 587
   - SMTP_USER: your-email@outlook.com
   - SMTP_PASS: your-password

#### Option C: Custom SMTP Server
1. Get your SMTP server details from your email provider
2. Configure the settings accordingly

### 3. Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Get your cloud name, API key, and API secret
4. Configure your upload preset (optional)

### 4. Vercel Deployment

#### A. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

#### B. Configure Environment Variables

Add these environment variables in Vercel dashboard:

```env
# Database
DATABASE_URL="your-database-connection-string"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"

# Email Service (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 5. Deploy

1. Click "Deploy" in Vercel
2. Monitor the build process
3. Check for any errors in the build logs

## 🔧 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Your Vercel domain | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | `your-secret-key-here` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username/email | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password/app password | `your-app-password` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |

## 🚨 Troubleshooting

### Common Issues

#### Email Not Sending
1. Check SMTP credentials
2. Verify SMTP server settings
3. Check if your email provider allows SMTP access
4. For Gmail, ensure you're using an App Password, not your regular password

#### Database Connection Issues
1. Verify your DATABASE_URL is correct
2. Check if your database allows external connections
3. Ensure your database is running

#### Build Failures
1. Check all environment variables are set
2. Verify all dependencies are installed
3. Check the build logs for specific errors

## 📞 Support

If you encounter any issues during deployment:

1. Check the Vercel build logs
2. Verify all environment variables are set correctly
3. Test your SMTP configuration locally first
4. Contact support if needed

---

**Note**: Make sure to replace all placeholder values with your actual credentials before deploying. 