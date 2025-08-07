import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
        amenities: {
          include: {
            amenity: true
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(property)

  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

// PUT /api/properties/[id] - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const {
      title,
      description,
      price,
      type,
      status,
      bedrooms,
      bathrooms,
      area,
      address,
      city,
      state,
      zipCode,
      featured,
      imageUrls = [],
      amenityIds = []
    } = body

    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      include: { images: true, amenities: true }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Update property with transaction to handle images and amenities
    const property = await prisma.$transaction(async (tx) => {
      // Delete existing images and amenities
      await tx.propertyImage.deleteMany({
        where: { propertyId: id }
      })
      await tx.propertyAmenity.deleteMany({
        where: { propertyId: id }
      })

      // Update property
      const updatedProperty = await tx.property.update({
        where: { id },
        data: {
          title,
          description,
          price: price ? parseFloat(price) : undefined,
          type,
          status,
          bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
          bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
          area: area ? parseFloat(area) : undefined,
          address,
          city,
          state,
          zipCode,
          featured,
          images: {
            create: imageUrls.map((url: string, index: number) => ({
              url,
              isPrimary: index === 0
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

      return updatedProperty
    })

    return NextResponse.json(property)

  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

// DELETE /api/properties/[id] - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Delete property (cascade will handle images and amenities)
    await prisma.property.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Property deleted successfully' })

  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
} 