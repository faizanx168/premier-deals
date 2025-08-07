import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, validateImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('images') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      )
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      // Validate file
      if (!validateImage({ mimetype: file.type, size: file.size })) {
        return NextResponse.json(
          { error: 'Invalid file type or size. Only JPEG, PNG, WebP up to 10MB allowed.' },
          { status: 400 }
        )
      }

      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer())
      
      // Upload to Cloudinary
      const url = await uploadImage(buffer)
      uploadedUrls.push(url)
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 