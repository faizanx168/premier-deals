import { PrismaClient, UserRole, PropertyType, PropertyStatus, InquiryStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@premierdeals.pk' },
    update: {},
    create: {
      email: 'admin@premierdeals.pk',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 12),
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create sample users
  const sampleUsers = [
    {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: await bcrypt.hash('password123', 12),
      role: UserRole.USER,
    },
    {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: await bcrypt.hash('password123', 12),
      role: UserRole.REALTOR,
    },
  ]

  for (const userData of sampleUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    })
    console.log('✅ Sample user created:', user.email)
  }

  // Create amenities
  const amenities = [
    // Interior Amenities
    { name: 'Air Conditioning', category: 'Interior' },
    { name: 'Heating', category: 'Interior' },
    { name: 'Balcony', category: 'Interior' },
    { name: 'Built-in Wardrobes', category: 'Interior' },
    { name: 'Modern Kitchen', category: 'Interior' },
    { name: 'Dishwasher', category: 'Interior' },
    { name: 'Washing Machine', category: 'Interior' },
    { name: 'Furnished', category: 'Interior' },
    { name: 'Study Room', category: 'Interior' },
    { name: 'Walk-in Closet', category: 'Interior' },
    
    // Exterior Amenities
    { name: 'Garden', category: 'Exterior' },
    { name: 'Parking', category: 'Exterior' },
    { name: 'Swimming Pool', category: 'Exterior' },
    { name: 'Gym', category: 'Exterior' },
    { name: 'Security System', category: 'Exterior' },
    { name: 'CCTV', category: 'Exterior' },
    { name: 'Elevator', category: 'Exterior' },
    { name: 'Backup Power', category: 'Exterior' },
    
    // Community Amenities
    { name: 'Mosque Nearby', category: 'Community' },
    { name: 'School Nearby', category: 'Community' },
    { name: 'Hospital Nearby', category: 'Community' },
    { name: 'Shopping Mall', category: 'Community' },
    { name: 'Public Transport', category: 'Community' },
    { name: 'Playground', category: 'Community' },
    { name: 'Community Center', category: 'Community' },
  ]

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {},
      create: amenity,
    })
  }

  console.log('✅ Amenities created')

  // Create sample properties
  const properties = [
    {
      title: 'Luxury Villa in F-7 Markaz',
      description: 'Beautiful 5-bedroom villa with modern amenities, located in the prestigious F-7 sector of Islamabad. Features include a spacious garden, swimming pool, and security system.',
      price: 85000000,
      type: PropertyType.SALE,
      status: PropertyStatus.ACTIVE,
      bedrooms: 5,
      bathrooms: 4,
      area: 4500,
      address: 'House 123, Street 12',
      city: 'Islamabad',
      state: 'Federal Territory',
      zipCode: '44000',
      featured: true,
    },
    {
      title: 'Penthouse in E-11',
      description: 'Exclusive penthouse with panoramic city views. Features include a private terrace, modern kitchen, and luxury finishes throughout.',
      price: 120000000,
      type: PropertyType.SALE,
      status: PropertyStatus.PENDING,
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      address: 'Penthouse 1, E-11 Heights',
      city: 'Islamabad',
      state: 'Federal Territory',
      zipCode: '44000',
      featured: true,
    },
    {
      title: 'Commercial Space in DHA',
      description: 'Prime commercial space suitable for retail or office use. High foot traffic area with excellent visibility.',
      price: 65000000,
      type: PropertyType.SALE,
      status: PropertyStatus.ACTIVE,
      bedrooms: 0,
      bathrooms: 2,
      area: 2500,
      address: 'Shop 12, DHA Commercial Plaza',
      city: 'Islamabad',
      state: 'Federal Territory',
      zipCode: '44000',
      featured: false,
    },
    {
      title: 'Residential Plot in Bahria Town',
      description: 'Premium residential plot in Bahria Town, Islamabad. Ready for construction with all utilities available.',
      price: 35000000,
      type: PropertyType.LAND,
      status: PropertyStatus.ACTIVE,
      bedrooms: 0,
      bathrooms: 0,
      area: 5000,
      address: 'Plot 78, Sector A',
      city: 'Islamabad',
      state: 'Federal Territory',
      zipCode: '44000',
      featured: false,
    },
  ]

  for (const property of properties) {
    await prisma.property.create({
      data: {
        ...property,
        user: {
          connect: {
            email: 'admin@premierdeals.pk'
          }
        }
      },
    })
  }

  console.log('✅ Sample properties created')

  // Create sample inquiries
  const inquiries = [
    {
      name: 'Ahmed Khan',
      email: 'ahmed@example.com',
      phone: '+92 300 1234567',
      message: 'I am very interested in this property. Can I schedule a viewing?',
      status: InquiryStatus.NEW,
    },
    {
      name: 'Fatima Ali',
      email: 'fatima@example.com',
      phone: '+92 301 2345678',
      message: 'Looking for investment opportunities. What are the rental yields?',
      status: InquiryStatus.CONTACTED,
    },
  ]

  // Get the first property to connect inquiries
  const firstProperty = await prisma.property.findFirst()
  
  if (firstProperty) {
    for (const inquiry of inquiries) {
      await prisma.inquiry.create({
        data: {
          ...inquiry,
          property: {
            connect: {
              id: firstProperty.id
            }
          }
        },
      })
    }
    console.log('✅ Sample inquiries created')
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 