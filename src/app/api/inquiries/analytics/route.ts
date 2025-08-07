import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Calculate date ranges
    const now = new Date()
    
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get total inquiries
    const totalInquiries = await prisma.inquiry.count()

    // Get inquiries by status
    const newInquiries = await prisma.inquiry.count({
      where: { status: 'NEW' }
    })

    const contactedInquiries = await prisma.inquiry.count({
      where: { status: 'CONTACTED' }
    })

    const viewingScheduled = await prisma.inquiry.count({
      where: { status: 'VIEWING_SCHEDULED' }
    })

    const offerMade = await prisma.inquiry.count({
      where: { status: 'OFFER_MADE' }
    })

    const closedInquiries = await prisma.inquiry.count({
      where: { status: 'CLOSED' }
    })

    const spamInquiries = await prisma.inquiry.count({
      where: { status: 'SPAM' }
    })

    // Get inquiries this month vs last month
    const inquiriesThisMonth = await prisma.inquiry.count({
      where: {
        createdAt: {
          gte: thisMonthStart
        }
      }
    })

    const inquiriesLastMonth = await prisma.inquiry.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd
        }
      }
    })

    // Calculate conversion rate (closed / total)
    const conversionRate = totalInquiries > 0 ? (closedInquiries / totalInquiries) * 100 : 0

    // Mock average response time (in hours)
    const avgResponseTime = 2.3

    // Get top properties by inquiry count
    const topProperties = await prisma.inquiry.groupBy({
      by: ['propertyId'],
      _count: {
        id: true
      },
      where: {
        propertyId: {
          not: undefined
        }
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    })

    // Get property titles for top properties
    const topPropertiesWithTitles = await Promise.all(
      topProperties.map(async (property) => {
        const propertyDetails = await prisma.property.findUnique({
          where: { id: property.propertyId },
          select: { title: true }
        })
        return {
          propertyId: property.propertyId || '',
          propertyTitle: propertyDetails?.title || 'Unknown Property',
          inquiryCount: property._count.id
        }
      })
    )

    // Calculate status distribution
    const statusDistribution = [
      { status: 'NEW', count: newInquiries, percentage: totalInquiries > 0 ? (newInquiries / totalInquiries) * 100 : 0 },
      { status: 'CONTACTED', count: contactedInquiries, percentage: totalInquiries > 0 ? (contactedInquiries / totalInquiries) * 100 : 0 },
      { status: 'VIEWING_SCHEDULED', count: viewingScheduled, percentage: totalInquiries > 0 ? (viewingScheduled / totalInquiries) * 100 : 0 },
      { status: 'OFFER_MADE', count: offerMade, percentage: totalInquiries > 0 ? (offerMade / totalInquiries) * 100 : 0 },
      { status: 'CLOSED', count: closedInquiries, percentage: totalInquiries > 0 ? (closedInquiries / totalInquiries) * 100 : 0 },
      { status: 'SPAM', count: spamInquiries, percentage: totalInquiries > 0 ? (spamInquiries / totalInquiries) * 100 : 0 }
    ]

    // Generate monthly trend data (last 6 months)
    const monthlyTrend = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const count = await prisma.inquiry.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      })

      monthlyTrend.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        count
      })
    }

    const analytics = {
      totalInquiries,
      newInquiries,
      contactedInquiries,
      viewingScheduled,
      offerMade,
      closedInquiries,
      spamInquiries,
      conversionRate: Math.round(conversionRate * 10) / 10, // Round to 1 decimal
      avgResponseTime,
      inquiriesThisMonth,
      inquiriesLastMonth,
      topProperties: topPropertiesWithTitles,
      statusDistribution,
      monthlyTrend
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching inquiry analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
} 