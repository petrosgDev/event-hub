"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    // Create university
    const university = await prisma.university.upsert({
        where: { slug: 'dbu' },
        update: {},
        create: {
            name: 'DBU University',
            slug: 'dbu',
            domain: 'dbu.edu.et',
            address: 'Dire Dawa, Ethiopia',
            isActive: true,
        },
    });
    // Create categories
    const categoriesData = [
        { name: 'Workshop', slug: 'workshop', icon: '🔧', color: '#8B5CF6', description: 'Hands-on learning sessions' },
        { name: 'Seminar', slug: 'seminar', icon: '🎤', color: '#3B82F6', description: 'Lectures and presentations' },
        { name: 'Competition', slug: 'competition', icon: '🏆', color: '#F59E0B', description: 'Competitive events' },
        { name: 'Science Week', slug: 'science-week', icon: '🔬', color: '#10B981', description: 'Scientific events and exhibitions' },
        { name: 'Cultural', slug: 'cultural', icon: '🎭', color: '#EC4899', description: 'Cultural celebrations and shows' },
        { name: 'Sports', slug: 'sports', icon: '⚽', color: '#EF4444', description: 'Sports events and tournaments' },
        { name: 'Training', slug: 'training', icon: '📚', color: '#06B6D4', description: 'Professional training programs' },
        { name: 'Networking', slug: 'networking', icon: '🤝', color: '#8B5CF6', description: 'Networking and social events' },
        { name: 'Hackathon', slug: 'hackathon', icon: '💻', color: '#6366F1', description: 'Coding and innovation challenges' },
        { name: 'Career Fair', slug: 'career-fair', icon: '💼', color: '#14B8A6', description: 'Career opportunities and job fairs' },
    ];
    for (const cat of categoriesData) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }
    const categories = await prisma.category.findMany();
    // Create super admin
    const adminPassword = await bcryptjs_1.default.hash('Admin@123', 12);
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@eventhub.dbu' },
        update: {},
        create: {
            email: 'admin@eventhub.dbu',
            password: adminPassword,
            firstName: 'System',
            lastName: 'Admin',
            role: 'SUPER_ADMIN',
            department: 'IT',
            isVerified: true,
            universityId: university.id,
        },
    });
    // Create admin
    const uniAdmin = await prisma.user.upsert({
        where: { email: 'uadmin@dbu.edu.et' },
        update: {},
        create: {
            email: 'uadmin@dbu.edu.et',
            password: adminPassword,
            firstName: 'University',
            lastName: 'Admin',
            role: 'ADMIN',
            department: 'Administration',
            isVerified: true,
            universityId: university.id,
        },
    });
    // Create organizer
    const organizer = await prisma.user.upsert({
        where: { email: 'organizer@dbu.edu.et' },
        update: {},
        create: {
            email: 'organizer@dbu.edu.et',
            password: adminPassword,
            firstName: 'Event',
            lastName: 'Organizer',
            role: 'ORGANIZER',
            department: 'Computer Science',
            isVerified: true,
            universityId: university.id,
        },
    });
    // Create test students
    const studentPassword = await bcryptjs_1.default.hash('Student@123', 12);
    const students = [];
    const studentData = [
        { email: 'student@dbu.edu.et', firstName: 'Ahmed', lastName: 'Mohammed', department: 'Computer Science', studentId: 'DBU/CS/001' },
        { email: 'sara@dbu.edu.et', firstName: 'Sara', lastName: 'Ali', department: 'Electrical Engineering', studentId: 'DBU/EE/002' },
        { email: 'john@dbu.edu.et', firstName: 'John', lastName: 'Doe', department: 'Business Administration', studentId: 'DBU/BA/003' },
        { email: 'fatima@dbu.edu.et', firstName: 'Fatima', lastName: 'Hassan', department: 'Computer Science', studentId: 'DBU/CS/004' },
        { email: 'daniel@dbu.edu.et', firstName: 'Daniel', lastName: 'Bekele', department: 'Information Technology', studentId: 'DBU/IT/005' },
    ];
    for (const s of studentData) {
        const student = await prisma.user.upsert({
            where: { email: s.email },
            update: {},
            create: {
                ...s,
                password: studentPassword,
                role: 'STUDENT',
                isVerified: true,
                universityId: university.id,
                interests: ['Technology', 'AI', 'Web Development'],
                streakCount: Math.floor(Math.random() * 15),
            },
        });
        students.push(student);
    }
    // Create clubs
    const club = await prisma.club.upsert({
        where: { slug: 'tech-club-dbu' },
        update: {},
        create: {
            name: 'Tech Club',
            slug: 'tech-club-dbu',
            description: 'Technology and innovation club for DBU students',
            universityId: university.id,
            presidentId: students[0].id,
        },
    });
    // Create events
    const now = new Date();
    const eventsData = [
        {
            title: 'AI & Machine Learning Workshop',
            description: 'An intensive hands-on workshop covering the fundamentals of AI and Machine Learning. Learn to build neural networks, understand deep learning concepts, and create real-world ML applications. This workshop is designed for students with basic programming knowledge who want to dive into the exciting world of artificial intelligence.',
            date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
            startTime: '09:00', endTime: '16:00',
            location: 'CS Building, Lab 301',
            capacity: 50, tags: ['AI', 'ML', 'Python', 'Workshop'],
            isFeatured: true, status: 'PUBLISHED',
        },
        {
            title: 'Annual Science Week 2026',
            description: 'Join us for the most anticipated academic event of the year! Science Week features research presentations, poster sessions, innovation showcases, and guest lectures from leading scientists. Students from all departments are welcome to participate and showcase their research projects.',
            date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
            startTime: '08:00', endTime: '18:00',
            location: 'Main Auditorium',
            capacity: 500, tags: ['Science', 'Research', 'Innovation'],
            isFeatured: true, status: 'PUBLISHED',
        },
        {
            title: 'Web Development Bootcamp',
            description: 'A comprehensive 2-day bootcamp covering modern web development with React, Next.js, and Node.js. Build a full-stack application from scratch and learn industry best practices. Perfect for beginners and intermediate developers looking to upgrade their skills.',
            date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
            startTime: '10:00', endTime: '17:00',
            location: 'Innovation Hub',
            capacity: 40, tags: ['React', 'Node.js', 'Web Dev'],
            isFeatured: true, status: 'PUBLISHED',
        },
        {
            title: 'Startup Pitch Competition',
            description: 'Got a brilliant startup idea? Present your pitch to a panel of experienced entrepreneurs and investors. Top 3 teams win seed funding and mentorship. Open to all students with innovative business ideas that can make a real impact.',
            date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
            startTime: '14:00', endTime: '19:00',
            location: 'Business School Auditorium',
            capacity: 200, tags: ['Startup', 'Business', 'Pitch'],
            isFeatured: false, status: 'PUBLISHED',
        },
        {
            title: 'Cybersecurity CTF Challenge',
            description: 'Test your cybersecurity skills in our Capture The Flag competition. Solve challenges in web security, cryptography, forensics, and more. Great prizes for top performers. Both beginners and experienced security enthusiasts are welcome!',
            date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
            startTime: '09:00', endTime: '21:00',
            location: 'CS Building, Lab 201',
            capacity: 30, tags: ['Cybersecurity', 'CTF', 'Hacking'],
            isFeatured: false, status: 'PUBLISHED',
        },
        {
            title: 'Data Science with Python',
            description: 'Learn data analysis, visualization, and machine learning with Python. This training covers Pandas, NumPy, Matplotlib, and Scikit-learn. Ideal for students looking to build a career in data science.',
            date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
            startTime: '10:00', endTime: '15:00',
            location: 'Online (Zoom)',
            isOnline: true,
            meetingUrl: 'https://zoom.us/j/example',
            capacity: 100, tags: ['Python', 'Data Science', 'Analytics'],
            isFeatured: false, status: 'PUBLISHED',
        },
        {
            title: 'Campus Cultural Night',
            description: 'Celebrate the rich cultural diversity of our campus! Enjoy traditional dances, music performances, poetry readings, and cultural food from across Ethiopia. A night of unity, celebration, and cultural exchange.',
            date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
            startTime: '18:00', endTime: '22:00',
            location: 'Campus Open Ground',
            capacity: 1000, tags: ['Culture', 'Music', 'Dance'],
            isFeatured: true, status: 'PUBLISHED',
        },
        {
            title: 'Career Fair 2026',
            description: 'Connect with top employers and explore career opportunities. Over 30 companies will be present including tech giants, startups, and consulting firms. Bring your resume and be ready for on-the-spot interviews.',
            date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
            startTime: '09:00', endTime: '17:00',
            location: 'Main Campus Hall',
            capacity: 800, tags: ['Career', 'Jobs', 'Networking'],
            isFeatured: true, status: 'PUBLISHED',
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
                registeredCount: Math.floor(Math.random() * 20),
                viewCount: Math.floor(Math.random() * 200) + 50,
            },
        });
        // Register some students for events
        for (let j = 0; j < Math.min(students.length, 3); j++) {
            try {
                await prisma.registration.create({
                    data: {
                        userId: students[j].id,
                        eventId: event.id,
                        status: 'CONFIRMED',
                        qrToken: `qr-${event.id}-${students[j].id}-${Date.now()}`,
                    },
                });
            }
            catch (e) {
                // Ignore duplicate key errors
            }
        }
    }
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📧 Test Accounts:');
    console.log('  Super Admin: admin@eventhub.dbu / Admin@123');
    console.log('  Admin:       uadmin@dbu.edu.et / Admin@123');
    console.log('  Organizer:   organizer@dbu.edu.et / Admin@123');
    console.log('  Student:     student@dbu.edu.et / Student@123');
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map