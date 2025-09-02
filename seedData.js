import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

import Student from './src/models/student.model.js';
import Teacher from './src/models/teacher.model.js';
import Freelancer from './src/models/freelancer.model.js';
import Company from './src/models/company.model.js';
import Program from './src/models/program.model.js';
import Contact from './src/models/contact.model.js';
import { CITTest } from './src/models/cit.model.js';

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (except admins)
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Freelancer.deleteMany({});
    await Company.deleteMany({});
    await Program.deleteMany({});
    await Contact.deleteMany({});
    await CITTest.deleteMany({});

    console.log('Cleared existing data');

    // Create sample students
    const students = await Student.create([
      {
        name: 'Alice Johnson',
        email: 'alice@student.com',
        phone: '+91-9876543210',
        password: await bcrypt.hash('password123', 10),
        role: 'student',
        resumeUrl: 'https://example.com/resume1.pdf',
        profileImage: 'https://via.placeholder.com/150'
      },
      {
        name: 'Bob Smith',
        email: 'bob@student.com',
        phone: '+91-9876543211',
        password: await bcrypt.hash('password123', 10),
        role: 'student',
        resumeUrl: 'https://example.com/resume2.pdf',
        profileImage: 'https://via.placeholder.com/150'
      },
      {
        name: 'Carol Davis',
        email: 'carol@student.com',
        phone: '+91-9876543212',
        password: await bcrypt.hash('password123', 10),
        role: 'student',
        resumeUrl: 'https://example.com/resume3.pdf',
        profileImage: 'https://via.placeholder.com/150'
      }
    ]);

    // Create sample teachers
    const teachers = await Teacher.create([
      {
        name: 'Dr. John Wilson',
        email: 'john@teacher.com',
        phone: '+91-9876543213',
        password: await bcrypt.hash('password123', 10),
        role: 'teacher',
        specialization: 'Web Development',
        experience: '8 years',
        profileImage: 'https://via.placeholder.com/150'
      },
      {
        name: 'Prof. Sarah Brown',
        email: 'sarah@teacher.com',
        phone: '+91-9876543214',
        password: await bcrypt.hash('password123', 10),
        role: 'teacher',
        specialization: 'Data Science',
        experience: '6 years',
        profileImage: 'https://via.placeholder.com/150'
      }
    ]);

    // Create sample freelancers
    const freelancers = await Freelancer.create([
      {
        name: 'Mike Chen',
        email: 'mike@freelancer.com',
        phone: '+91-9876543215',
        password: await bcrypt.hash('password123', 10),
        role: 'freelancer',
        skills: ['React', 'Node.js', 'MongoDB'],
        hourlyRate: 25,
        profileImage: 'https://via.placeholder.com/150'
      },
      {
        name: 'Lisa Wang',
        email: 'lisa@freelancer.com',
        phone: '+91-9876543216',
        password: await bcrypt.hash('password123', 10),
        role: 'freelancer',
        skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite'],
        hourlyRate: 30,
        profileImage: 'https://via.placeholder.com/150'
      }
    ]);

    // Create sample companies
    const companies = await Company.create([
      {
        name: 'TechCorp Solutions',
        email: 'hr@techcorp.com',
        phone: '+91-9876543217',
        password: await bcrypt.hash('password123', 10),
        role: 'company',
        industry: 'Technology',
        size: '100-500 employees',
        website: 'https://techcorp.com',
        profileImage: 'https://via.placeholder.com/150'
      },
      {
        name: 'Innovate Labs',
        email: 'careers@innovatelabs.com',
        phone: '+91-9876543218',
        password: await bcrypt.hash('password123', 10),
        role: 'company',
        industry: 'Startup',
        size: '10-50 employees',
        website: 'https://innovatelabs.com',
        profileImage: 'https://via.placeholder.com/150'
      }
    ]);

    // Create sample programs
    const programs = await Program.create([
      {
        title: 'Full Stack Web Development',
        type: 'training',
        domain: 'Web Development',
        description: 'Comprehensive course covering frontend and backend development with modern technologies.',
        duration: '6 months',
        mode: 'online',
        fees: 25000,
        certificateAvailable: true,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-08-31'),
        thumbnail: 'https://via.placeholder.com/300x200',
        syllabus: [
          'HTML, CSS, JavaScript Fundamentals',
          'React.js and Frontend Development',
          'Node.js and Backend Development',
          'Database Design and MongoDB',
          'Deployment and DevOps Basics'
        ]
      },
      {
        title: 'Data Science Internship',
        type: 'internship',
        domain: 'Data Science',
        description: 'Hands-on internship in data science with real-world projects and mentorship.',
        duration: '3 months',
        mode: 'hybrid',
        fees: 15000,
        certificateAvailable: true,
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-06-30'),
        thumbnail: 'https://via.placeholder.com/300x200',
        syllabus: [
          'Python for Data Science',
          'Machine Learning Algorithms',
          'Data Visualization',
          'Statistical Analysis',
          'Project Work and Portfolio Building'
        ]
      },
      {
        title: 'AI/ML Training Program',
        type: 'training',
        domain: 'Artificial Intelligence',
        description: 'Advanced training program in artificial intelligence and machine learning.',
        duration: '8 months',
        mode: 'online',
        fees: 35000,
        certificateAvailable: true,
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-12-31'),
        thumbnail: 'https://via.placeholder.com/300x200',
        syllabus: [
          'Mathematics for AI',
          'Deep Learning Fundamentals',
          'Natural Language Processing',
          'Computer Vision',
          'AI Ethics and Responsible AI'
        ]
      }
    ]);

    // Create sample contacts
    const contacts = await Contact.create([
      {
        name: 'David Miller',
        email: 'david@example.com',
        phone: '+919876543219',
        message: 'I am interested in the Full Stack Web Development program. Can you provide more details about the curriculum and job placement assistance?'
      },
      {
        name: 'Emma Wilson',
        email: 'emma@example.com',
        phone: '+919876543220',
        message: 'I would like to know about internship opportunities for computer science students. Are there any openings for summer 2024?'
      },
      {
        name: 'Alex Thompson',
        email: 'alex@example.com',
        phone: '+919876543221',
        message: 'I am a working professional looking to switch to tech. Do you have any part-time or weekend programs available?'
      }
    ]);

    // Create sample CIT tests
    const citTests = await CITTest.create([
      {
        title: 'Web Development Assessment',
        description: 'Comprehensive test covering HTML, CSS, JavaScript, and basic web development concepts.',
        startDate: new Date('2024-03-15'),
        duration: '2 hours',
        maxParticipants: 50,
        registeredParticipants: 25,
        status: 'upcoming',
        category: 'Web Development',
        difficulty: 'Intermediate',
        isActive: true
      },
      {
        title: 'Data Science Fundamentals',
        description: 'Test covering Python, statistics, and basic machine learning concepts.',
        startDate: new Date('2024-03-20'),
        duration: '3 hours',
        maxParticipants: 30,
        registeredParticipants: 18,
        status: 'upcoming',
        category: 'Data Science',
        difficulty: 'Beginner',
        isActive: true
      },
      {
        title: 'Advanced Programming',
        description: 'Advanced test covering algorithms, data structures, and system design.',
        startDate: new Date('2024-02-28'),
        duration: '3 hours',
        maxParticipants: 20,
        registeredParticipants: 20,
        status: 'completed',
        category: 'Web Development',
        difficulty: 'Advanced',
        isActive: false
      }
    ]);

    console.log('Sample data created successfully!');
    console.log(`- ${students.length} students`);
    console.log(`- ${teachers.length} teachers`);
    console.log(`- ${freelancers.length} freelancers`);
    console.log(`- ${companies.length} companies`);
    console.log(`- ${programs.length} programs`);
    console.log(`- ${contacts.length} contacts`);
    console.log(`- ${citTests.length} CIT tests`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData(); 