import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Helper functions for Cloudinary operations
export const uploadImage = async (file: Buffer, folder: string = 'premier-deals'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error: unknown, result: { secure_url: string } | undefined) => {
        if (error) {
          reject(error)
        } else {
          resolve(result!.secure_url)
        }
      }
    )

    uploadStream.end(file)
  })
}

export const deleteImage = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error: unknown) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

export const getImageUrl = (url: string, options: Record<string, unknown> = {}): string => {
  const defaultOptions = {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  }

  const finalOptions = { ...defaultOptions, ...options }
  
  // If it's already a Cloudinary URL, transform it
  if (url.includes('cloudinary.com')) {
    return cloudinary.url(url, finalOptions)
  }
  
  // If it's not a Cloudinary URL, return as is
  return url
}

export const validateImage = (file: { mimetype: string; size: number }): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!allowedTypes.includes(file.mimetype)) {
    return false
  }

  if (file.size > maxSize) {
    return false
  }

  return true
} 