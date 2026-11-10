import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding EventHub DBU database...');

  // Create university
  const university = await prisma.university.upsert({
    where: { slug: 'dbu' },
    update: {},
    create: {
      name: 'Debre Birhan University',
      slug: 'dbu',
      domain: 'dbu.edu.et',
      address: 'Debre Birhan, North Shewa, Ethiopia',
      isActive: true,
    },
  });

  // Create categories
  const categoriesData = [
    { name: 'Workshop', slug: 'workshop', icon: '🔧', color: '#8B5CF6', description: 'Hands-on learning sessions' },
    { name: 'Seminar', slug: 'seminar', icon: '🎤', color: '#3B82F6', description: 'Academic lectures and presentations' },
    { name: 'Competition', slug: 'competition', icon: '🏆', color: '#F59E0B', description: 'Competitive challenges' },
    { name: 'Science Week', slug: 'science-week', icon: '🔬', color: '#10B981', description: 'Scientific events and exhibitions' },
    { name: 'Cultural', slug: 'cultural', icon: '🎭', color: '#EC4899', description: 'Cultural celebrations and shows' },
    { name: 'Sports', slug: 'sports', icon: '⚽', color: '#EF4444', description: 'Sports events and tournaments' },
    { name: 'Training', slug: 'training', icon: '📚', color: '#06B6D4', description: 'Professional training programs' },
    { name: 'Networking', slug: 'networking', icon: '🤝', color: '#8B5CF6', description: 'Networking and social events' },
    { name: 'Hackathon', slug: 'hackathon', icon: '💻', color: '#6366F1', description: 'Coding and innovation challenges' },
    { name: 'Career Fair', slug: 'career-fair', icon: '💼', color: '#14B8A6', description: 'Career opportunities' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  const categories = await prisma.category.findMany();

  // ═══ CREATE USERS ═══
  const adminPassword = await bcrypt.hash('admin', 12);
  const vendorPassword = await bcrypt.hash('vendor', 12);
  const studentPassword = await bcrypt.hash('student', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@dbu.edu.et' },
    update: {},
    create: {
      email: 'admin@dbu.edu.et', password: adminPassword,
      firstName: 'System', lastName: 'Admin',
      role: 'SUPER_ADMIN', department: 'IT Administration',
      isVerified: true, universityId: university.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'uadmin@dbu.edu.et' },
    update: {},
    create: {
      email: 'uadmin@dbu.edu.et', password: adminPassword,
      firstName: 'University', lastName: 'Admin',
      role: 'ADMIN', department: 'Administration',
      isVerified: true, universityId: university.id,
    },
  });

  const organizer = await prisma.user.upsert({
    where: { email: 'vendor@dbu.edu.et' },
    update: {},
    create: {
      email: 'vendor@dbu.edu.et', password: vendorPassword,
      firstName: 'Event', lastName: 'Vendor',
      role: 'ORGANIZER', department: 'External Vendor',
      isVerified: true, hasPaidWorkspace: true,
      universityId: university.id,
    },
  });

  const students = [];
  const studentData = [
    { email: 'student@dbu.edu.et', firstName: 'Ahmed', lastName: 'Mohammed', department: 'Computer Science', studentId: 'DBU/CS/001' },
    { email: 'sara@dbu.edu.et', firstName: 'Sara', lastName: 'Ali', department: 'Electrical Engineering', studentId: 'DBU/EE/002' },
    { email: 'john@dbu.edu.et', firstName: 'Yohannes', lastName: 'Bekele', department: 'Business Administration', studentId: 'DBU/BA/003' },
    { email: 'fatima@dbu.edu.et', firstName: 'Fatima', lastName: 'Hassan', department: 'Computer Science', studentId: 'DBU/CS/004' },
    { email: 'daniel@dbu.edu.et', firstName: 'Daniel', lastName: 'Tadesse', department: 'Information Technology', studentId: 'DBU/IT/005' },
  ];

  for (const s of studentData) {
    const student = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        ...s, password: studentPassword, role: 'STUDENT',
        isVerified: true, universityId: university.id,
        interests: ['Technology', 'AI', 'Web Development'],
        streakCount: Math.floor(Math.random() * 15),
      },
    });
    students.push(student);
  }

  // Create club
  const club = await prisma.club.upsert({
    where: { slug: 'tech-club-dbu' },
    update: {},
    create: {
      name: 'DBU Tech Club', slug: 'tech-club-dbu',
      description: 'Technology and innovation club for DBU students',
      universityId: university.id, presidentId: students[0].id,
    },
  });

  // ═══ CREATE REAL DBU EVENTS ═══
  const now = new Date();
  const eventsData = [
    {
      title: 'AI & Machine Learning Workshop',
      description: 'An intensive hands-on workshop covering the fundamentals of AI and Machine Learning. Learn to build neural networks, understand deep learning concepts, and create real-world ML applications using Python and TensorFlow. Ideal for CS and IT students with basic programming knowledge.',
      date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      startTime: '09:00', endTime: '16:00',
      location: 'CS Building, Lab 301',
      capacity: 50, tags: ['AI', 'ML', 'Python', 'Workshop'],
      isFeatured: true, status: 'PUBLISHED' as const, isFree: false, price: 150,
      bannerImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    },
    {
      title: 'DBU Annual Science Week 2026',
      description: 'Join us for the most anticipated academic event of the year! Science Week features research presentations, poster sessions, innovation showcases, and guest lectures from leading Ethiopian scientists. Students from all departments are welcome to participate.',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      startTime: '08:00', endTime: '18:00',
      location: 'Main Auditorium',
      capacity: 500, tags: ['Science', 'Research', 'Innovation'],
      isFeatured: true, status: 'PUBLISHED' as const, isFree: true, price: 0,
      bannerImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
    },
    {
      title: 'Full-Stack Web Development Bootcamp',
      description: 'A comprehensive 2-day bootcamp covering modern web development with React, Next.js, and Node.js. Build a full-stack application from scratch and learn industry best practices. Perfect for beginners and intermediate developers.',
      date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      startTime: '10:00', endTime: '17:00',
      location: 'Innovation Hub, Room 205',
      capacity: 40, tags: ['React', 'Node.js', 'Web Dev'],
      isFeatured: true, status: 'PUBLISHED' as const, isFree: false, price: 200,
      bannerImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    },
    {
      title: 'Inter-Department Football Tournament',
      description: 'The annual inter-department football tournament is back! Teams from all departments compete for the DBU championship trophy. Come support your department and enjoy the excitement.',
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      startTime: '14:00', endTime: '18:00',
      location: 'DBU Sports Field',
      capacity: 300, tags: ['Football', 'Sports', 'Tournament'],
      isFeatured: false, status: 'PUBLISHED' as const, isFree: true, price: 0,
      bannerImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop',
    },
    {
      title: 'Cybersecurity CTF Challenge',
      description: 'Test your cybersecurity skills in our Capture The Flag competition. Solve challenges in web security, cryptography, forensics, and more. Great prizes for top performers!',
      date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
      startTime: '09:00', endTime: '21:00',
      location: 'CS Building, Lab 201',
      capacity: 30, tags: ['Cybersecurity', 'CTF', 'Hacking'],
      isFeatured: false, status: 'PUBLISHED' as const, isFree: false, price: 100,
      bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
    },
    {
      title: 'Campus Cultural Night',
      description: 'Celebrate the rich cultural diversity of our campus! Enjoy traditional dances, music performances, poetry readings, and cultural food from across Ethiopia. A night of unity and celebration.',
      date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      startTime: '18:00', endTime: '22:00',
      location: 'Campus Open Ground',
      capacity: 1000, tags: ['Culture', 'Music', 'Dance', 'Food'],
      isFeatured: true, status: 'PUBLISHED' as const, isFree: true, price: 0,
      bannerImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop',
    },
    {
      title: 'Career Fair & Job Expo 2026',
      description: 'Connect with top Ethiopian employers and explore career opportunities. Over 30 companies will be present. Bring your resume and be ready for on-the-spot interviews.',
      date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      startTime: '09:00', endTime: '17:00',
      location: 'Main Campus Hall',
      capacity: 800, tags: ['Career', 'Jobs', 'Networking'],
      isFeatured: true, status: 'PUBLISHED' as const, isFree: true, price: 0,
      bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    },
    {
      title: 'Entrepreneurship & Startup Pitch',
      description: 'Got a brilliant startup idea? Present your pitch to a panel of experienced entrepreneurs and investors. Top 3 teams win seed funding and mentorship opportunities.',
      date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      startTime: '14:00', endTime: '19:00',
      location: 'Business School Auditorium',
      capacity: 200, tags: ['Startup', 'Business', 'Pitch'],
      isFeatured: false, status: 'PUBLISHED' as const, isFree: false, price: 50,
      bannerImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    },
  ];

  for (let i = 0; i < eventsData.length; i++) {
    const catIndex = i % categories.length;
    const eventSlug = eventsData[i].title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36) + i;
    
    const event = await prisma.event.upsert({
      where: { slug: eventSlug },
      update: {},
      create: {
        ...eventsData[i],
        slug: eventSlug,
        organizerId: organizer.id,
        universityId: university.id,
        categoryId: categories[catIndex].id,
        clubId: i < 3 ? club.id : undefined,
        registeredCount: Math.floor(Math.random() * 20) + 5,
        viewCount: Math.floor(Math.random() * 200) + 50,
        ticketTiers: {
          create: [
            {
              name: eventsData[i].isFree ? 'Free Admission' : 'General Admission',
              price: eventsData[i].isFree ? 0 : eventsData[i].price,
              capacity: eventsData[i].capacity,
            }
          ]
        }
      },
    });

    // Register students
    for (let j = 0; j < Math.min(students.length, 3); j++) {
      try {
        await prisma.registration.create({
          data: {
            userId: students[j].id, eventId: event.id,
            status: 'CONFIRMED',
            qrToken: `qr-${event.id}-${students[j].id}-${Date.now()}`,
          },
        });
      } catch (e) { /* Ignore duplicates */ }
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📧 Test Accounts:');
  console.log('  Admin/Super Admin: admin@dbu.edu.et / admin');
  console.log('  Vendor/Organizer:  vendor@dbu.edu.et / vendor');
  console.log('  Student:           student@dbu.edu.et / student');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
