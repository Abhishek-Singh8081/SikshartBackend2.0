import express from 'express';
// import User from '../models/user.model.js'; 
import { getAllHackathonContacts } from '../controllers/hackathoncontact.controller.js';
import { getAllHackathons } from '../controllers/hackathoncontroller.js';
import { getAllSpeakers } from '../controllers/hackathonspeaker.controller.js';
import { getAllInternships, getInternshipById ,getInternshipBySlug} from '../controllers/internship.controllers.js';
import {applyForInternship,getRegistrationsByStudentId} from '../controllers/internshipresgistration.controller.js';
import { isFreelancer, isStudent, isStudentOrFreelancer, protectRoute } from '../middlewares/auth.middleware.js';
import { getHackathonById } from '../controllers/hackathoncontroller.js';
import { createHackathonRegistration } from '../controllers/hackathonregistration.js';
import { updateStudent } from '../controllers/studentdashboard.controller.js';
import { iscollege } from '../middlewares/auth.middleware.js';
import { getCollegeProfile, getHackathonsByCollege, updateCollegeProfile } from '../controllers/college.controller.js';
import { getAllCards } from '../controllers/hackathoncardrbenefit.controller.js';

const router = express.Router();
router.get("/getallhackathoncontacts", getAllHackathonContacts);
router.get("/getallhackathons",getAllHackathons);
router.get("/getallspeakers",getAllSpeakers);
router.get("/getallinternships",getAllInternships)
router.get("/getinternshipbyid/:id",getInternshipById)
router.get("/getinternshipbyslug/:slug",getInternshipBySlug)
router.post("/applyforiinternship/:internshipId",protectRoute,isStudentOrFreelancer,applyForInternship)
router.get("/getregistrationsbystudentid",protectRoute,getRegistrationsByStudentId)
router.get("/gethackathonbyid/:id",getHackathonById);
router.get("/gethackathonregistrationsbystudentid",protectRoute,getRegistrationsByStudentId)
router.post("/applyforhackathon",protectRoute,isStudentOrFreelancer,createHackathonRegistration)
router.put("/updatestudent/:id",protectRoute,isStudent,updateStudent);
router.get("/gethackathonbycollege/:collegeId",protectRoute,iscollege,getHackathonsByCollege);
router.get("/getcollegeprofile/:collegeId",protectRoute,iscollege,getCollegeProfile);
router.put("/updatecollegeprofile/:collegeId",protectRoute,iscollege,updateCollegeProfile);
router.get("/getallcards", getAllCards);

export default router;
