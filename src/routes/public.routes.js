import express from 'express';
// import User from '../models/user.model.js'; 
// import { getAllHackathonContacts } from '../controllers/hackathoncontact.controller.js';
import { getAllHackathons } from '../controllers/hackathoncontroller.js';
import { getAllSpeakers } from '../controllers/hackathonspeaker.controller.js';
import { getAllInternships, getInternshipById ,getInternshipBySlug} from '../controllers/internship.controllers.js';
import {applyForInternship,getRegistrationsByStudentId} from '../controllers/internshipresgistration.controller.js';
import { isAdmin, isFreelancer, isStudent, isStudentOrFreelancer, protectRoute } from '../middlewares/auth.middleware.js';
import { getHackathonById } from '../controllers/hackathoncontroller.js';
import { createHackathonRegistration } from '../controllers/hackathonregistration.js';
import { deleteStudent, getAllStudents, getStudentById, updateStudent } from '../controllers/studentdashboard.controller.js';
import { iscollege } from '../middlewares/auth.middleware.js';
import { getAllColleges, getCollegeProfile, getHackathonsByCollege, updateCollegeProfile } from '../controllers/college.controller.js';
import { getAllCards } from '../controllers/hackathoncardrbenefit.controller.js';
import { getAllCTAs } from '../controllers/cta.controller.js';
import { getAllFAQs } from '../controllers/hackathonfaq.controller.js';
import {submitContact,getAllContacts} from "../controllers/hackathoncontact.controller.js"
import {getMedia,uploadSingleImage, uploadSingleVideo} from "../controllers/hackathongallery.controller.js"
import { getProfile } from '../controllers/auth.controller.js';

const router = express.Router();
// router.get("/getallhackathoncontacts", getAllHackathonContacts);
router.get("/getallhackathons",getAllHackathons);
router.get("/getallspeakers",getAllSpeakers);
router.get("/getallinternships",getAllInternships)
router.get("/getinternshipbyid/:id",getInternshipById)
router.get("/getinternshipbyslug/:slug",getInternshipBySlug)
router.post("/applyforiinternship/:internshipId",protectRoute,isStudentOrFreelancer,applyForInternship)
router.get("/getregistrationsbystudentid",protectRoute,getRegistrationsByStudentId)//for getting all internships registration
router.get("/gethackathonbyid/:id",getHackathonById);
router.get("/gethackathonregistrationsbystudentid",protectRoute,getRegistrationsByStudentId)
router.post("/applyforhackathon",protectRoute,isStudentOrFreelancer,createHackathonRegistration)
router.put("/updatestudent/:id",protectRoute,isStudent,updateStudent);
router.get("/gethackathonbycollege/:collegeId",protectRoute,iscollege,getHackathonsByCollege);
router.get("/getcollegeprofile/:collegeId",protectRoute,iscollege,getCollegeProfile);


router.put("/updatecollegeprofile/:collegeId",protectRoute,iscollege,updateCollegeProfile);
router.get("/getallcards", getAllCards);
router.get("/getallcalltoactions",getAllCTAs)
router.get("/getallfaqs",getAllFAQs)
router.post("/createhackathoncontact",submitContact)
router.get("/getallmedia",getMedia)
router.post("/uploadimages",uploadSingleImage)
router.post("/uploadvideo",uploadSingleVideo)
router.get("/userprofile",protectRoute,getProfile)
router.get("/getallcollage",getAllColleges)

//students
router.get("/getallstudents",getAllStudents)
router.get("/getstudentbyid/:id",getStudentById)
router.put("/updatestudent/:id",isStudent,updateStudent)






export default router;
