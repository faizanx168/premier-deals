import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get recent inquiries
    const recentInquiries = await prisma.inquiry.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        property: {
          select: {
            title: true
          }
        }
      }
    })

    // Get recent property updates
    const recentProperties = await prisma.property.findMany({
      take: 5,
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Create activities from real data
    const activities: Array<{
      id: string
      type: string
      title: string
      description: string
      timestamp: string
      icon: string
      color: string
    }> = []

    // Add inquiry activities
    recentInquiries.forEach((inquiry) => {
      activities.push({
        id: `inquiry-${inquiry.id}`,
        type: 'inquiry',
        title: 'New Inquiry',
        description: `${inquiry.name} inquired about ${inquiry.property?.title || 'a property'}`,
        timestamp: inquiry.createdAt.toISOString(),
        icon: 'MessageSquare',
        color: 'blue'
      })
    })

    // Add property activities
    recentProperties.forEach((property) => {
      activities.push({
        id: `property-${property.id}`,
        type: 'property',
        title: 'Property Updated',
        description: `${property.title} status updated to ${property.status}`,
        timestamp: property.updatedAt.toISOString(),
        icon: 'Home',
        color: 'green'
      })
    })

    // Sort activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Return top 10 activities
    return NextResponse.json(activities.slice(0, 10))
  } catch (error) {
    console.error('Error fetching dashboard activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard activities' },
      { status: 500 }
    )
  }
} 