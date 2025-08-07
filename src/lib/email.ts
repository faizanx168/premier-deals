import nodemailer from 'nodemailer'

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail(emailData: EmailData) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

export function generateVerificationEmail(email: string, token: string, name: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify?token=${token}`
  
  return {
    to: email,
    subject: 'Verify your email - Premier Deals',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">Premier Deals</h1>
              <p style="color: #666; margin: 10px 0;">Professional Real Estate Solutions</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 8px;">
              <h2 style="color: #1f2937; margin-top: 0;">Welcome to Premier Deals!</h2>
              
              <p>Hi ${name},</p>
              
              <p>Thank you for registering with Premier Deals. To complete your registration, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666; font-size: 14px;">${verificationUrl}</p>
              
              <p>This verification link will expire in 24 hours.</p>
              
              <p>If you didn't create an account with Premier Deals, you can safely ignore this email.</p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #666; font-size: 14px;">
                Best regards,<br>
                The Premier Deals Team
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

export function generateWelcomeEmail(email: string, name: string) {
  return {
    to: email,
    subject: 'Welcome to Premier Deals!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Premier Deals</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">Premier Deals</h1>
              <p style="color: #666; margin: 10px 0;">Professional Real Estate Solutions</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 8px;">
              <h2 style="color: #1f2937; margin-top: 0;">Welcome to Premier Deals!</h2>
              
              <p>Hi ${name},</p>
              
              <p>Thank you for verifying your email address! Your account is now active and you can start exploring our premium real estate listings.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/properties" 
                   style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Browse Properties
                </a>
              </div>
              
              <p>Here's what you can do with your Premier Deals account:</p>
              <ul style="color: #4b5563;">
                <li>Browse our extensive property listings</li>
                <li>Save your favorite properties</li>
                <li>Contact property owners and agents</li>
                <li>Get notified about new listings</li>
                <li>Access exclusive deals and offers</li>
              </ul>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #666; font-size: 14px;">
                Best regards,<br>
                The Premier Deals Team
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

export function generatePasswordResetEmail(email: string, token: string, name: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  
  return {
    to: email,
    subject: 'Reset your password - Premier Deals',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">Premier Deals</h1>
              <p style="color: #666; margin: 10px 0;">Professional Real Estate Solutions</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 8px;">
              <h2 style="color: #1f2937; margin-top: 0;">Reset Your Password</h2>
              
              <p>Hi ${name},</p>
              
              <p>We received a request to reset your password for your Premier Deals account. Click the button below to create a new password:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Reset Password
                </a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666; font-size: 14px;">${resetUrl}</p>
              
              <p>This password reset link will expire in 1 hour.</p>
              
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #666; font-size: 14px;">
                Best regards,<br>
                The Premier Deals Team
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  }
} 