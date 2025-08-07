import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/amenities - List all amenities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const where = category ? { category } : {}

    const amenities = await prisma.amenity.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(amenities)

  } catch (error) {
    console.error('Error fetching amenities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch amenities' },
      { status: 500 }
    )
  }
}

// POST /api/amenities - Create new amenity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, category } = body

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // Check if amenity already exists
    const existingAmenity = await prisma.amenity.findUnique({
      where: { name }
    })

    if (existingAmenity) {
      return NextResponse.json(
        { error: 'Amenity with this name already exists' },
        { status: 400 }
      )
    }

    const amenity = await prisma.amenity.create({
      data: {
        name,
        category
      }
    })

    return NextResponse.json(amenity, { status: 201 })

  } catch (error) {
    console.error('Error creating amenity:', error)
    return NextResponse.json(
      { error: 'Failed to create amenity' },
      { status: 500 }
    )
  }
} 