import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/inquiries/[id] - Get individual inquiry details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            type: true,
            status: true,
            address: true,
            city: true,
            state: true,
            images: {
              select: {
                url: true,
                isPrimary: true
              }
            }
          }
        }
      }
    })

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ inquiry })
  } catch (error) {
    console.error('Error fetching inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiry' },
      { status: 500 }
    )
  }
}

// PUT /api/inquiries/[id] - Update inquiry status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['NEW', 'CONTACTED', 'VIEWING_SCHEDULED', 'OFFER_MADE', 'CLOSED', 'SPAM']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update inquiry
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { 
        status: status || undefined,
        // Add notes field if it exists in schema, otherwise remove this line
        // notes: notes || undefined
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            type: true,
            status: true,
            address: true,
            city: true,
            state: true,
            images: {
              select: {
                url: true,
                isPrimary: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ inquiry })
  } catch (error) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    )
  }
}

// DELETE /api/inquiries/[id] - Delete inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.inquiry.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Inquiry deleted successfully' })
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    )
  }
} 