# Premier Deals - Professional Realtor App

A modern, professional realtor application for Premier Deals to showcase properties (rentals, sales, land) with a beautiful UI and robust backend.

## 🚀 Project Overview

**Premier Deals** is a full-stack realtor application built with Next.js 14, TypeScript, Prisma, and Tailwind CSS. The app allows realtors to showcase their portfolio, manage properties, and handle client inquiries.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (recommended) or SQLite (development)
- **Authentication**: NextAuth.js
- **Image Storage**: Cloudinary or AWS S3
- **Email Service**: Resend or Nodemailer
- **Deployment**: Vercel (frontend + API) + PlanetScale/Neon (database)

## 📋 Project Status

### ✅ Completed (Phase 1 - Foundation)
- [x] Project setup with Next.js 14, TypeScript, Tailwind
- [x] Prisma setup with database schema
- [x] Basic folder structure and routing
- [x] Authentication system with NextAuth.js
- [x] Basic UI components library
- [x] User registration page (UI only)

### 🔄 In Progress
- [ ] Email verification system
- [ ] User registration API
- [ ] Password reset functionality
- [ ] Email service integration

## 🎯 Development Phases

### Phase 1: Foundation (Week 1) - ✅ COMPLETED
1. ✅ Project setup with Next.js 14, TypeScript, Tailwind
2. ✅ Prisma setup with database schema
3. ✅ Basic folder structure and routing
4. ✅ Authentication system with NextAuth.js
5. ✅ Basic UI components library

### Phase 2: Core Features (Week 2) - 🔄 IN PROGRESS
1. 🔄 User registration and email verification
2. 🔄 Property CRUD operations
3. 🔄 Image upload and management
4. 🔄 Property listing pages with filters
5. 🔄 Property detail pages
6. 🔄 Basic admin dashboard

### Phase 3: User Experience (Week 3)
1. Advanced search and filtering
2. Contact forms and inquiry system
3. Responsive design optimization
4. SEO optimization
5. Performance optimization

### Phase 4: Polish & Deploy (Week 4)
1. Advanced admin features
2. Analytics and reporting
3. Testing and bug fixes
4. Deployment setup
5. Documentation

## 🔧 Required Changes for User Authentication

### 1. Database Schema Updates ✅ COMPLETED
**File**: `prisma/schema.prisma`
**Changes Made**:
- Added `emailVerified` field for email verification
- Added `verificationToken` for email verification links
- Added `resetToken` and `resetTokenExpiry` for password reset
- Added `USER` role to UserRole enum
- Changed default role from `ADMIN` to `USER`

**Next Steps**:
```bash
# Run database migration
npm run db:migrate
```

### 2. Authentication System Updates 🔄 REQUIRED

#### A. Update NextAuth Configuration
**File**: `src/lib/auth.ts`
**Required Changes**:
- Add email verification check in authorize function
- Add support for unverified users
- Update session callbacks to handle email verification status

#### B. Update Type Definitions
**File**: `src/types/next-auth.d.ts`
**Required Changes**:
```typescript
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: "ADMIN" | "REALTOR" | "USER"
      emailVerified?: Date
    }
  }

  interface User {
    id: string
    name: string
    email: string
    role: "ADMIN" | "REALTOR" | "USER"
    emailVerified?: Date
  }
}
```

### 3. API Routes Implementation 🔄 REQUIRED

#### A. User Registration API
**File**: `src/app/api/auth/register/route.ts`
**Required Features**:
- Email validation
- Password hashing
- Duplicate email check
- Email verification token generation
- Email sending functionality

#### B. Email Verification API
**File**: `src/app/api/auth/verify/route.ts`
**Required Features**:
- Token validation
- Email verification status update
- User activation

#### C. Password Reset API
**File**: `src/app/api/auth/reset-password/route.ts`
**Required Features**:
- Email validation
- Reset token generation
- Password reset functionality

#### D. Email Service Integration
**File**: `src/lib/email.ts`
**Required Features**:
- Email template system
- Email sending functionality
- Error handling

### 4. Email Service Setup 🔄 REQUIRED

#### A. Install Email Dependencies
```bash
npm install resend nodemailer
npm install @types/nodemailer --save-dev
```

#### B. Environment Variables
**File**: `.env.local`
**Required Variables**:
```env
# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key"

# Alternative: SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 5. Middleware Updates 🔄 REQUIRED

#### A. Update Route Protection
**File**: `src/middleware.ts`
**Required Changes**:
- Add support for user roles (USER, REALTOR, ADMIN)
- Implement email verification checks
- Add public routes for registration and verification

### 6. UI Components Updates 🔄 REQUIRED

#### A. Update Login Page
**File**: `src/app/(auth)/login/page.tsx`
**Required Changes**:
- Add link to registration page
- Add email verification status check
- Add password reset link

#### B. Create Email Verification Page
**File**: `src/app/(auth)/verify/page.tsx`
**Required Features**:
- Token validation
- Success/error messages
- Redirect to login

#### C. Create Password Reset Pages
**Files**: 
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`
**Required Features**:
- Email input form
- Token validation
- Password reset form

### 7. Email Templates 🔄 REQUIRED

#### A. Create Email Template Components
**Directory**: `src/components/emails/`
**Required Templates**:
- `verification-email.tsx`
- `password-reset-email.tsx`
- `welcome-email.tsx`

### 8. Database Migration 🔄 REQUIRED

#### A. Run Database Migration
```bash
# Generate Prisma client with new schema
npm run db:generate

# Push schema changes to database
npm run db:push

# Or run migration if using migrations
npm run db:migrate
```

### 9. Update Seed File 🔄 REQUIRED

#### A. Update Admin User Creation
**File**: `prisma/seed.ts`
**Required Changes**:
- Set emailVerified to current date for admin user
- Add sample regular users
- Update role assignments

### 10. Environment Setup 🔄 REQUIRED

#### A. Create `.env.local` File
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/premier_deals"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email Service
RESEND_API_KEY="your-resend-api-key"

# AWS S3 Configuration
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-s3-bucket-name"
```

## 📋 Implementation Checklist

### Phase 2.1: User Authentication (Priority: HIGH)

#### Day 1: Database & Email Setup
- [ ] Install email dependencies
- [ ] Set up email service (Resend)
- [ ] Run database migration
- [ ] Update environment variables

#### Day 2: API Implementation
- [ ] Create registration API (`/api/auth/register`)
- [ ] Create email verification API (`/api/auth/verify`)
- [ ] Create password reset API (`/api/auth/reset-password`)
- [ ] Create email service utility (`src/lib/email.ts`)

#### Day 3: Authentication Updates
- [ ] Update NextAuth configuration
- [ ] Update type definitions
- [ ] Update middleware for role-based access
- [ ] Test authentication flow

#### Day 4: UI Implementation
- [ ] Update login page with registration link
- [ ] Create email verification page
- [ ] Create password reset pages
- [ ] Create email templates

#### Day 5: Testing & Polish
- [ ] Test registration flow
- [ ] Test email verification
- [ ] Test password reset
- [ ] Fix any bugs

### Phase 2.2: Property Management (Priority: MEDIUM)
- [ ] Property CRUD operations
- [ ] Image upload and management
- [ ] Property listing pages with filters
- [ ] Property detail pages

### Phase 2.3: Admin Dashboard (Priority: MEDIUM)
- [ ] Basic admin dashboard
- [ ] Property management interface
- [ ] Inquiry management

## 🔒 Security Considerations

### Email Verification
- Use secure, time-limited tokens
- Implement rate limiting for email sending
- Validate email format and domain
- Handle token expiration gracefully

### Password Security
- Use bcrypt for password hashing
- Implement password strength requirements
- Add rate limiting for login attempts
- Implement account lockout for failed attempts

### Session Management
- Use secure, HTTP-only cookies
- Implement session timeout
- Add CSRF protection
- Validate user permissions on each request

## 📧 Email Service Options

### Option 1: Resend (Recommended)
- Modern, developer-friendly API
- Good deliverability
- Reasonable pricing
- Easy integration

### Option 2: Nodemailer with SMTP
- More control over email delivery
- Can use any SMTP provider
- Requires more configuration
- Good for custom requirements

### Option 3: SendGrid
- Enterprise-grade email service
- Advanced features
- Higher cost
- Excellent deliverability

## 🚀 Deployment Considerations

### Environment Variables
- Set up production email service
- Configure production database
- Set secure NEXTAUTH_SECRET
- Configure production URLs

### Email Templates
- Use responsive email templates
- Test across email clients
- Include unsubscribe links
- Follow email best practices

### Security Headers
- Configure CSP headers
- Set up rate limiting
- Enable HTTPS redirects
- Configure security middleware

## 📞 Support & Troubleshooting

### Common Issues

1. **Email Not Sending**
   ```bash
   # Check email service configuration
   # Verify API keys
   # Check rate limits
   ```

2. **Database Migration Issues**
   ```bash
   # Reset database
   npx prisma migrate reset
   # Re-run migrations
   npm run db:migrate
   ```

3. **Authentication Issues**
   ```bash
   # Clear NextAuth cache
   rm -rf .next
   # Restart development server
   npm run dev
   ```

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