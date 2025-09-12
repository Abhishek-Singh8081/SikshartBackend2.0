import express from 'express';
import { isAdmin, isCompany, protectRoute } from '../middlewares/auth.middleware.js';
import Student from '../models/student.model.js';
import Admin from '../models/admin.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Teacher from '../models/teacher.model.js';
import Freelancer from '../models/freelancer.model.js';
import Company from '../models/company.model.js';
import Internship from '../models/internship.model.js';
import Instructor from '../models/instructor.model.js';
import { createHackathon,getAllHackathons,getHackathonById,updateHackathon,deleteHackathon,addBenefit,deleteBenefit,addPrizePool,deletePrizePool,addLeagueFormat,deleteLeagueFormat } from '../controllers/hackathoncontroller.js';
import { createHackathonContact,deleteHackathonContact,updateHackathonContact,getAllHackathonContacts } from '../controllers/hackathoncontact.controller.js';
import { createSpeaker,deleteSpeaker,updateSpeaker } from '../controllers/hackathonspeaker.controller.js';
import { createInternship,getAllInternships,updateInternship,deleteInternship } from '../controllers/internship.controllers.js';
import { adminAuth } from '../middlewares/admin.middleware.js';
import { getAllInternshipRegistrations } from '../controllers/internshipresgistration.controller.js';
import { createAboutPage,updateAboutPage,addSection,updateSection,toggleSectionVisibility } from '../controllers/hackathonabout.controller.js';
import { createCard,deleteCard,updateCard } from "../controllers/hackathoncardrbenefit.controller.js"
import { createCTA,updateCTA,deleteCTA } from '../controllers/cta.controller.js';
import { createFAQ,updateFAQ,deleteFAQ } from '../controllers/hackathonfaq.controller.js';

// import {protectRoute} from '../middlewares/auth.middleware.js';


const router = express.Router();

// Public admin login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    // Generate JWT
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.cookie('accessToken', token, {  
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.json({
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      accessToken: token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin profile route for authentication check
router.get('/profile', async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.userId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json({ user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Protect all other admin routes
router.use(protectRoute);

// Users CRUD
router.get('/users', async (req, res) => {
  const { type } = req.query;
  try {
    if (type === 'student') {
      const students = await Student.find();
      return res.json(students);
    }
    if (type === 'teacher') {
      const teachers = await Teacher.find();
      return res.json(teachers);
    }
    if (type === 'freelancer') {
      const freelancers = await Freelancer.find();
      return res.json(freelancers);
    }
    if (type === 'company') {
      const companies = await Company.find();
      return res.json(companies);
    }
    return res.status(400).json({ message: 'Invalid user type' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.post('/users', async (req, res) => {
  const { type, name, email, phone, password } = req.body;
  try {
    if (type === 'student') {
      const existing = await Student.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already exists' });
      const student = new Student({ name, email, phone, password, role: 'student' });
      await student.save();
      return res.status(201).json(student);
    }
    if (type === 'teacher') {
      const existing = await Teacher.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already exists' });
      const teacher = new Teacher({ name, email, phone, password, role: 'teacher' });
      await teacher.save();
      return res.status(201).json(teacher);
    }
    if (type === 'freelancer') {
      const existing = await Freelancer.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already exists' });
      const freelancer = new Freelancer({ name, email, phone, password, role: 'freelancer' });
      await freelancer.save();
      return res.status(201).json(freelancer);
    }
    if (type === 'company') {
      const existing = await Company.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already exists' });
      const company = new Company({ name, email, phone, password, role: 'company' });
      await company.save();
      return res.status(201).json(company);
    }
    return res.status(400).json({ message: 'Invalid user type' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create user' });
  }
});

router.put('/users/:id', async (req, res) => {
  const { type, name, email, phone } = req.body;
  try {
    if (type === 'student') {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { name, email, phone },
        { new: true }
      );
      if (!student) return res.status(404).json({ message: 'Student not found' });
      return res.json(student);
    }
    if (type === 'teacher') {
      const teacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        { name, email, phone },
        { new: true }
      );
      if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
      return res.json(teacher);
    }
    if (type === 'freelancer') {
      const freelancer = await Freelancer.findByIdAndUpdate(
        req.params.id,
        { name, email, phone },
        { new: true }
      );
      if (!freelancer) return res.status(404).json({ message: 'Freelancer not found' });
      return res.json(freelancer);
    }
    if (type === 'company') {
      const company = await Company.findByIdAndUpdate(
        req.params.id,
        { name, email, phone },
        { new: true }
      );
      if (!company) return res.status(404).json({ message: 'Company not found' });
      return res.json(company);
    }
    return res.status(400).json({ message: 'Invalid user type' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req, res) => {
  const { type } = req.query;
  try {
    if (type === 'student') {
      const student = await Student.findByIdAndDelete(req.params.id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      return res.json({ message: 'Student deleted' });
    }
    if (type === 'teacher') {
      const teacher = await Teacher.findByIdAndDelete(req.params.id);
      if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
      return res.json({ message: 'Teacher deleted' });
    }
    if (type === 'freelancer') {
      const freelancer = await Freelancer.findByIdAndDelete(req.params.id);
      if (!freelancer) return res.status(404).json({ message: 'Freelancer not found' });
      return res.json({ message: 'Freelancer deleted' });
    }
    if (type === 'company') {
      const company = await Company.findByIdAndDelete(req.params.id);
      if (!company) return res.status(404).json({ message: 'Company not found' });
      return res.json({ message: 'Company deleted' });
    }
    return res.status(400).json({ message: 'Invalid user type' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete user' });
  }
});

// CIT CRUD
router.get('/cit/tests', (req, res) => res.json({ message: 'List CIT tests' }));
router.post('/cit/tests', (req, res) => res.json({ message: 'Create CIT test' }));
router.put('/cit/tests/:id', (req, res) => res.json({ message: 'Update CIT test' }));
router.delete('/cit/tests/:id', (req, res) => res.json({ message: 'Delete CIT test' }));

// Internships CRUD
router.get('/internships', async (req, res) => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch internships' });
  }
});

router.get('/internships/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch internship' });
  }
});

router.post('/internships', async (req, res) => {
  try {
    const internship = new Internship(req.body);
    await internship.save();
    res.status(201).json(internship);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create internship' });
  }
});

router.put('/internships/:id', async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update internship' });
  }
});

router.delete('/internships/:id', async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.json({ message: 'Internship deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete internship' });
  }
});

// Public internships route
router.get('/internships', async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch internships' });
  }
});

// Contact Enquiries
router.get('/contact', (req, res) => res.json({ message: 'List contact enquiries' }));
router.delete('/contact/:id', (req, res) => res.json({ message: 'Delete contact enquiry' }));

// Add user counts endpoint
router.get('/user-counts', async (req, res) => {
  try {
    const [students, teachers, freelancers, companies, admins] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Freelancer.countDocuments(),
      Company.countDocuments(),
      Admin.countDocuments(),
    ]);
    res.json({ students, teachers, freelancers, companies, admins });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user counts' });
  }
});

// Admin: Get all instructors
router.get('/instructors', protectRoute, async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch instructors' });
  }
});

// Admin: Create instructor
router.post('/instructors', protectRoute, async (req, res) => {
  try {
    const instructor = new Instructor(req.body);
    await instructor.save();
    res.status(201).json(instructor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create instructor' });
  }
});

// Admin: Update instructor
router.put('/instructors/:id', protectRoute, async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
    res.json(instructor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update instructor' });
  }
});

// Admin: Delete instructor
router.delete('/instructors/:id', protectRoute, async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
    res.json({ message: 'Instructor deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete instructor' });
  }
});

// Admins CRUD
router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find().select('-password -refreshToken');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admins' });
  }
});

router.post('/admins', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword, role: role || 'admin' });
    await admin.save();
    res.status(201).json({ _id: admin._id, name: admin.name, email: admin.email, role: admin.role });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create admin' });
  }
});

router.put('/admins/:id', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const update = { name, email, role };
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }
    const admin = await Admin.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json({ _id: admin._id, name: admin.name, email: admin.email, role: admin.role });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update admin' });
  }
});

router.delete('/admins/:id', async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json({ message: 'Admin deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete admin' });
  }
});



// Hackathon routes
router.post("/createhackathon",protectRoute,isAdmin, createHackathon);


router.patch("/updatehackathon/:id",protectRoute,isAdmin,updateHackathon);
router.delete("/deletehackathon/:id",protectRoute,isAdmin,deleteHackathon);
router.post("/addbenefit/:id",protectRoute,isAdmin,addBenefit);
router.delete("/deletebenefit/:id/:benefitId",protectRoute,isAdmin,deleteBenefit);
router.post("/addprizepool/:id",protectRoute,isAdmin,addPrizePool);
router.delete("/deleteprizepool/:id/:prizePoolId",protectRoute,isAdmin,deletePrizePool);
router.post("/addleagueformat/:id",protectRoute,isAdmin,addLeagueFormat);
router.delete("/deleteleagueformat/:id/:leagueFormatId",protectRoute,isAdmin,deleteLeagueFormat);
// router.post("/createinternship",adminAuth, createInternship);
router.post("/createinternship",protectRoute,isAdmin, createInternship);
router.put("/updateinternship/:id",protectRoute,isAdmin, updateInternship);


router.post("/createhackathoncontact",protectRoute,isAdmin, createHackathonContact);
router.put("/updatehackathoncontact/:id",protectRoute,isAdmin, updateHackathonContact);

router.delete("/deletehackathoncontact/:id",protectRoute,isAdmin, deleteHackathonContact);

router.post("/createspeaker",protectRoute,isAdmin, createSpeaker);
router.delete("/deletespeaker/:id",protectRoute,isAdmin, deleteSpeaker);
router.put("/updatespeaker/:id",protectRoute,isAdmin, updateSpeaker);

router.get("/getallregisrationforinternships",protectRoute,isAdmin,getAllInternshipRegistrations)
router.post("/createaboutpage",protectRoute,isAdmin,createAboutPage );
router.put("/updateaboutpage",protectRoute,isAdmin,updateAboutPage );
router.post("/addsection",protectRoute,isAdmin,addSection );
router.put("/updatesection/:slug",protectRoute,isAdmin,updateSection );
router.put("/togglesectionvisibility",protectRoute,isAdmin,toggleSectionVisibility)



router.post("/createcard",protectRoute,isAdmin, createCard);

// GET - Fetch all cards


// DELETE - Delete card by cardNumber
router.delete("/deletecard/:cardNumber", protectRoute,isAdmin,deleteCard);
router.put("/updatecard/:cardNumber", protectRoute,isAdmin,updateCard);
router.post("/createcalltoaction",protectRoute,isAdmin,createCTA)
router.put("/updatecalltoaction/:id",protectRoute,isAdmin,updateCTA)
router.delete("/deletecalltoaction/:id",protectRoute,isAdmin,deleteCTA)
router.post("/createfaq",protectRoute,isAdmin,createFAQ)
router.put("/updatefaq/:id",protectRoute,isAdmin,updateFAQ)
router.delete("/deletefaq/:id",protectRoute,isAdmin,deleteFAQ)



export default router; 