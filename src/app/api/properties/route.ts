import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma, PropertyType, PropertyStatus } from '@prisma/client'

// GET /api/properties - List properties with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const city = searchParams.get('city')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    // Build where clause
    const where: Prisma.PropertyWhereInput = {}

    if (type && Object.values(PropertyType).includes(type as PropertyType)) {
      where.type = type as PropertyType
    }
    if (status && Object.values(PropertyStatus).includes(status as PropertyStatus)) {
      where.status = status as PropertyStatus
    }
    if (featured === 'true') where.featured = true
    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) }
    if (bathrooms) where.bathrooms = { gte: parseInt(bathrooms) }
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get properties with images and amenities
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: {
            orderBy: { order: 'asc' }
          },
          amenities: {
            include: {
              amenity: true
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      prisma.property.count({ where })
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    })

  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      title,
      description,
      price,
      type,
      bedrooms,
      bathrooms,
      area,
      address,
      city,
      state,
      zipCode,
      country = 'USA',
      latitude,
      longitude,
      featured = false,
      imageUrls = [],
      amenityIds = []
    } = body

    // Validate required fields
    if (!title || !description || !price || !type || !address || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create property with images and amenities
    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        type,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        area: area ? parseFloat(area) : null,
        address,
        city,
        state,
        zipCode,
        country,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        featured,
        images: {
          create: imageUrls.map((url: string, index: number) => ({
            url,
            isPrimary: index === 0,
            order: index
          }))
        },
        amenities: {
          create: amenityIds.map((amenityId: string) => ({
            amenityId
          }))
        }
      },
      include: {
        images: true,
        amenities: {
          include: {
            amenity: true
          }
        }
      }
    })

    return NextResponse.json(property, { status: 201 })

  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
} 