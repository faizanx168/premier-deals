import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, generateContactAdminEmail, generateContactUserConfirmationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, subject, message } = body || {}

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'firstName, lastName, email, subject, and message are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send notification to admin
    const adminEmail = generateContactAdminEmail({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
    })

    // Send confirmation to user
    const userConfirmationEmail = generateContactUserConfirmationEmail({
      to: email,
      firstName,
      subject,
    })

    try {
      await Promise.all([sendEmail(adminEmail), sendEmail(userConfirmationEmail)])
    } catch (err) {
      console.error('Failed sending contact emails:', err)
      return NextResponse.json(
        { error: 'Failed to send emails. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


