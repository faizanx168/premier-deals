# Premier Deals - Professional Realtor App

A modern, professional realtor application for Premier Deals to showcase properties (rentals, sales, land) with a beautiful UI and robust backend.

## 🚀 Project Overview

**Premier Deals** is a full-stack realtor application built with Next.js 14, TypeScript, Prisma, and Tailwind CSS. The app allows realtors to showcase their portfolio, manage properties, and handle client inquiries.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (recommended) or SQLite (development)
- **Authentication**: NextAuth.js
- **Image Storage**: AWS S3
- **Email Service**: Resend
- **Deployment**: Vercel

## 📋 Project Status

### ✅ Completed (Phase 1 & 2 - Foundation & Core Features)
- [x] Project setup with Next.js 14, TypeScript, Tailwind
- [x] Prisma setup with database schema
- [x] Basic folder structure and routing
- [x] Authentication system with NextAuth.js
- [x] Basic UI components library
- [x] User registration and email verification
- [x] Property CRUD operations
- [x] Image upload and management (AWS S3)
- [x] Property listing pages with filters
- [x] Property detail pages
- [x] Admin dashboard with property management
- [x] Inquiry management system
- [x] Email service integration
- [x] Password reset functionality
- [x] **Vercel deployment ready**

### 🔄 In Progress
- [ ] Advanced search and filtering
- [ ] Analytics and reporting
- [ ] Performance optimization
- [ ] SEO optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- AWS S3 bucket (for image uploads)
- Resend account (for emails)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd premier-deals
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🚀 Deployment

### Vercel Deployment

This project is optimized for Vercel deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deployment Steps:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

3. **Set Environment Variables**
   ```env
   DATABASE_URL="your-production-database-url"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   NEXTAUTH_SECRET="your-secret-key"
   RESEND_API_KEY="your-resend-api-key"
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="us-east-1"
   AWS_S3_BUCKET_NAME="your-bucket-name"
   ```

4. **Deploy**
   - Vercel will automatically build and deploy
   - Check deployment logs for any issues

## 📁 Project Structure

```
premier-deals/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Admin dashboard
│   │   ├── api/               # API routes
│   │   └── properties/        # Public property pages
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   └── property/         # Property components
│   ├── lib/                  # Utility libraries
│   └── types/                # TypeScript types
├── prisma/                   # Database schema
├── public/                   # Static assets
└── scripts/                  # Deployment scripts
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio

# Deployment
npm run deploy          # Run deployment script
```

## 🔒 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/premier_deals"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email Service
RESEND_API_KEY="your-resend-api-key"

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-bucket-name"
```

## 🎯 Features

### ✅ Implemented Features

#### Authentication & User Management
- [x] User registration with email verification
- [x] Login/logout functionality
- [x] Password reset via email
- [x] Role-based access control (ADMIN, REALTOR, USER)
- [x] Protected routes and middleware

#### Property Management
- [x] Create, read, update, delete properties
- [x] Image upload and management (AWS S3)
- [x] Property filtering and search
- [x] Property status management
- [x] Featured properties

#### Admin Dashboard
- [x] Property management interface
- [x] Inquiry management
- [x] User management
- [x] Analytics and statistics
- [x] Bulk operations

#### Public Features
- [x] Property listings with filters
- [x] Property detail pages
- [x] Contact forms and inquiries
- [x] Responsive design
- [x] SEO optimization

#### Email System
- [x] Email verification
- [x] Password reset emails
- [x] Welcome emails
- [x] Inquiry notifications

### 🔄 Planned Features

#### Advanced Search & Filtering
- [ ] Advanced property search
- [ ] Map-based property search
- [ ] Saved searches
- [ ] Property recommendations

#### Analytics & Reporting
- [ ] Property performance analytics
- [ ] User behavior tracking
- [ ] Revenue reporting
- [ ] Lead conversion tracking

#### Performance & SEO
- [ ] Image optimization
- [ ] Caching strategies
- [ ] SEO optimization
- [ ] Performance monitoring

## 🚨 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
# Regenerate Prisma client
npm run db:generate
# Reinstall dependencies
rm -rf node_modules && npm install
```

#### Database Issues
```bash
# Reset database
npm run db:push
# Seed database
npm run db:seed
```

#### Authentication Issues
```bash
# Check environment variables
# Verify NEXTAUTH_URL and NEXTAUTH_SECRET
# Clear browser cookies
```

## 📞 Support

- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: Create an issue on GitHub
- **Email**: support@premierdeals.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

**Premier Deals** - Professional Real Estate Solutions