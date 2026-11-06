const dotenv = require('dotenv');
dotenv.config();

const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const mongoose = require('mongoose');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Team = require('../models/Team');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Opportunity.deleteMany();
    await Team.deleteMany();
    await Project.deleteMany();
    await Notification.deleteMany();
    console.log('Cleared previous database collections.');

    // 1. Create Users (Admin, Organizer, Students)
    const adminUser = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'admin@campusconnect.edu',
      password: 'password123',
      role: 'admin',
      college: 'Institute of Engineering & Technology',
      bio: 'CampusConnect Head Administrator & Faculty Advisor',
      skills: ['Administration', 'Cloud Architecture', 'Mentorship'],
    });

    const organizerUser = await User.create({
      name: 'TechClub Innovators',
      email: 'organizer@campusconnect.edu',
      password: 'password123',
      role: 'organizer',
      college: 'National University',
      bio: 'Official campus tech club organizing hackathons, workshops, and hiring drives.',
      skills: ['Event Planning', 'Tech Outreach', 'Sponsorship'],
    });

    const student1 = await User.create({
      name: 'Alex Rivera',
      email: 'student@campusconnect.edu',
      password: 'password123',
      role: 'student',
      college: 'Apex Institute of Technology',
      degree: 'B.Tech in Computer Science',
      graduationYear: 2026,
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'TailwindCSS'],
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
      bio: 'Full Stack MERN developer passionate about building scalable web apps and competing in hackathons.',
    });

    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@campusconnect.edu',
      password: 'password123',
      role: 'student',
      college: 'Apex Institute of Technology',
      degree: 'B.Tech in Information Technology',
      graduationYear: 2026,
      skills: ['Python', 'TensorFlow', 'FastAPI', 'Machine Learning', 'Data Science'],
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
      bio: 'AI/ML enthusiast focused on computer vision and predictive analytics for healthcare.',
    });

    const student3 = await User.create({
      name: 'David Kim',
      email: 'david@campusconnect.edu',
      password: 'password123',
      role: 'student',
      college: 'Apex Institute of Technology',
      degree: 'B.Tech in Software Engineering',
      graduationYear: 2025,
      skills: ['UI/UX', 'Figma', 'CSS3', 'Next.js', 'TypeScript'],
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
      bio: 'Frontend designer and craftsperson passionate about seamless user experiences and modern design systems.',
    });

    console.log('Sample Users created.');

    // 2. Create Opportunities
    const opp1 = await Opportunity.create({
      organizerId: organizerUser._id,
      title: 'National Hackathon 2026 – HackTheFuture',
      description: 'A 36-hour continuous collegiate hackathon tackling sustainability, FinTech, and AI for Good. Prizes worth $10,000 + VC mentorship.',
      category: 'hackathon',
      locationType: 'hybrid',
      location: 'San Francisco & Online',
      organizationName: 'Global Student Tech Foundation',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      requiredSkills: ['React', 'Node.js', 'Python', 'AI/ML'],
      rewardOrStipend: '$10,000 Cash Pool & Cloud Credits',
      status: 'open',
    });

    const opp2 = await Opportunity.create({
      organizerId: organizerUser._id,
      title: 'Summer 2026 Full-Stack Engineering Internship',
      description: 'Looking for a passionate junior frontend/backend engineer to work on core cloud platform services with microservices and React.',
      category: 'internship',
      locationType: 'remote',
      location: 'Remote, US / Global',
      organizationName: 'Vanguard Cloud Solutions',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      requiredSkills: ['React', 'Node.js', 'REST APIs', 'PostgreSQL'],
      rewardOrStipend: '$3,500 / Month + Pre-Placement Offer',
      status: 'open',
    });

    const opp3 = await Opportunity.create({
      organizerId: organizerUser._id,
      title: 'Hands-on Cloud & Kubernetes Workshop',
      description: 'Zero to hero interactive workshop covering Docker containerization, Kubernetes clusters, and automated CI/CD deployment pipelines.',
      category: 'workshop',
      locationType: 'remote',
      location: 'Online via Zoom',
      organizationName: 'DevOps Campus Chapter',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      requiredSkills: ['Linux', 'Docker', 'Git'],
      rewardOrStipend: 'Official Certificate & Cloud Voucher',
      status: 'open',
    });

    console.log('Sample Opportunities created.');

    // 3. Create Teams
    const team1 = await Team.create({
      leaderId: student1._id,
      title: 'FinAI – Smart Algorithmic Financial Advisor',
      description: 'Building an AI-driven personal budgeting and automated investment rebalancing engine for college students for the upcoming HackTheFuture Hackathon.',
      requiredSkills: ['Python', 'FastAPI', 'React', 'Financial APIs'],
      totalPositions: 4,
      openPositions: 2,
      members: [student1._id, student2._id],
      visibility: 'public',
      status: 'recruiting',
      contactDiscordOrSlack: 'discord.gg/finai-hack',
    });

    const team2 = await Team.create({
      leaderId: student3._id,
      title: 'EcoTrack – Campus Carbon Footprint Tracker',
      description: 'IoT and web app measuring dining hall food waste and dorm electricity consumption to gamify sustainability on campus.',
      requiredSkills: ['IoT', 'Node.js', 'React Native', 'Data Visualization'],
      totalPositions: 3,
      openPositions: 1,
      members: [student3._id],
      visibility: 'public',
      status: 'recruiting',
      contactDiscordOrSlack: 'slack.com/ecotrack',
    });

    console.log('Sample Teams created.');

    // 4. Create Projects
    await Project.create({
      ownerId: student1._id,
      title: 'DevPulse – Real-Time Code Collaboration IDE',
      description: 'Browser-based multiplayer code editor with Monaco Editor, WebSockets for cursor syncing, and Docker sandbox for instant code execution in 12 languages.',
      technologies: ['React', 'Node.js', 'Socket.io', 'Docker', 'Monaco Editor'],
      githubRepo: 'https://github.com/campusconnect/devpulse',
      liveDemo: 'https://devpulse-demo.vercel.app',
      screenshotUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
      likes: [student2._id, student3._id],
    });

    await Project.create({
      ownerId: student2._id,
      title: 'MedVision – Chest X-Ray Pneumonia Classifier',
      description: 'Deep convolutional neural network trained on over 5,000 radiograph images to classify chest anomalies with 94.6% AUC score.',
      technologies: ['PyTorch', 'FastAPI', 'React', 'Docker', 'OpenCV'],
      githubRepo: 'https://github.com/campusconnect/medvision',
      liveDemo: 'https://medvision-ai.streamlit.app',
      screenshotUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      likes: [student1._id],
    });

    console.log('Sample Projects created.');

    // 5. Create Initial Notification
    await Notification.create({
      recipientId: student1._id,
      senderId: organizerUser._id,
      title: 'Welcome to CampusConnect! 🎉',
      message: 'Explore open hackathons, build your dream project team, or showcase your portfolio.',
      type: 'system',
      link: '/opportunities',
      isRead: false,
    });

    console.log('========================================================');
    console.log('🎉 Database seeding completed successfully!');
    console.log('Demo Credentials:');
    console.log('  Admin:     admin@campusconnect.edu     / password123');
    console.log('  Organizer: organizer@campusconnect.edu / password123');
    console.log('  Student:   student@campusconnect.edu   / password123');
    console.log('========================================================');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
