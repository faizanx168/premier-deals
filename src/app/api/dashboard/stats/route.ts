import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get current date and first day of current month
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Fetch all properties
    const totalProperties = await prisma.property.count()
    
    // Fetch properties created this month
    const propertiesThisMonth = await prisma.property.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth
        }
      }
    })

    // Fetch all inquiries
    const totalInquiries = await prisma.inquiry.count()
    
    // Fetch inquiries this month
    const inquiriesThisMonth = await prisma.inquiry.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth
        }
      }
    })

    // Fetch pending inquiries
    const pendingInquiries = await prisma.inquiry.count({
      where: {
        status: 'NEW'
      }
    })

    // Calculate total revenue (sum of all property prices)
    const properties = await prisma.property.findMany({
      select: {
        price: true,
        status: true
      }
    })

    const totalRevenue = properties.reduce((sum, property) => {
      if (property.status === 'SOLD' || property.status === 'RENTED') {
        return sum + Number(property.price)
      }
      return sum
    }, 0)

    // Calculate revenue this month
    const propertiesSoldThisMonth = await prisma.property.findMany({
      where: {
        status: {
          in: ['SOLD', 'RENTED']
        },
        updatedAt: {
          gte: firstDayOfMonth
        }
      },
      select: {
        price: true
      }
    })

    const revenueThisMonth = propertiesSoldThisMonth.reduce((sum, property) => {
      return sum + Number(property.price)
    }, 0)

    // Calculate active properties
    const activeProperties = await prisma.property.count({
      where: {
        status: 'ACTIVE'
      }
    })

    // Calculate conversion rate (inquiries per property)
    const conversionRate = totalProperties > 0 ? (totalInquiries / totalProperties) * 100 : 0

    // Mock data for views (since we don't have view tracking yet)
    const totalViews = totalProperties * 120 // Mock calculation
    const viewsThisMonth = propertiesThisMonth * 120

    // Mock average response time (in hours)
    const avgResponseTime = 2.3

    const stats = {
      totalProperties,
      totalInquiries,
      totalViews,
      totalRevenue,
      propertiesThisMonth,
      inquiriesThisMonth,
      viewsThisMonth,
      revenueThisMonth,
      activeProperties,
      pendingInquiries,
      conversionRate: Math.round(conversionRate * 10) / 10, // Round to 1 decimal
      avgResponseTime
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
} 