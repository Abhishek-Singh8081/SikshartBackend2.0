import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import Freelancer from "../models/freelancer.model.js";
import Admin from "../models/admin.model.js";
import Company from "../models/company.model.js";
import Program from "../models/program.model.js";
import Application from "../models/application.model.js";

export const getDashboardSummary = async (req, res) => {
  try {
    // Fallback to admin for testing if no user (should not happen with protectRoute, but safe)
    const role = req.user?.role || "admin";
    const _id = req.user?._id || null;
    let data = {};

    switch (role) {
      case "student":
        data = {
          quickStats: {
            activeCourses: 4,
            completedCourses: 12,
            averageScore: 88,
            hoursStudied: 128,
          },
          recentActivity: [
            { type: "assignment", text: "Submitted assignment for React Course", date: "2025-06-27" },
            { type: "program", text: "Joined 'AI/ML Internship' program", date: "2025-06-25" },
            { type: "course", text: "Completed 'Web Development' course", date: "2025-06-20" },
          ],
          notifications: [
            { text: "New internship available: Cloud Computing", date: "2025-06-27" },
            { text: "Exam schedule released for Data Science", date: "2025-06-26" },
            { text: "Your certificate is ready for download", date: "2025-06-25" },
          ],
          deadlines: [
            { title: "React Project", due: "2025-07-10" },
            { title: "ML Assignment", due: "2025-07-15" },
          ],
        };
        break;
      case "college":
        data = {
          quickStats: {
            totalStudents: 120,
            programs: 5,
            applications: 30,
            faculty: 20,
          },
          recentActivity: [
            { type: "student", text: "New student registered: Alice Smith", date: "2025-06-27" },
            { type: "program", text: "Launched 'Blockchain' program", date: "2025-06-25" },
          ],
          notifications: [
            { text: "Accreditation review scheduled", date: "2025-06-27" },
          ],
          deadlines: [
            { title: "Semester Exams", due: "2025-07-20" },
          ],
        };
        break;
      case "company":
        data = {
          quickStats: {
            internships: 4,
            applicants: 50,
            hired: 10,
            interviews: 15,
          },
          recentActivity: [
            { type: "hire", text: "Hired John Doe for Web Dev Internship", date: "2025-06-27" },
            { type: "post", text: "Posted new internship: Data Analysis", date: "2025-06-25" },
          ],
          notifications: [
            { text: "New applicant: Jane Smith", date: "2025-06-27" },
          ],
          deadlines: [
            { title: "Interview Round 1", due: "2025-07-05" },
          ],
        };
        break;
      case "freelancer":
        data = {
          quickStats: {
            projects: 6,
            earnings: 1200,
            reviews: 4.8,
            opportunities: 3,
          },
          recentActivity: [
            { type: "project", text: "Completed project for Acme Corp", date: "2025-06-27" },
            { type: "review", text: "Received 5-star review from Tech Ltd.", date: "2025-06-25" },
          ],
          notifications: [
            { text: "New project opportunity: UI/UX Design", date: "2025-06-27" },
          ],
          deadlines: [
            { title: "Submit Invoice", due: "2025-07-03" },
          ],
        };
        break;
      case "admin":
        data = {
          quickStats: {
            users: 500,
            reports: 12,
            systemHealth: "Good",
            stats: {
              students: 300,
              colleges: 10,
              companies: 20,
              freelancers: 170,
            },
          },
          recentActivity: [
            { type: "report", text: "Reviewed abuse report #1234", date: "2025-06-27" },
          ],
          notifications: [
            { text: "System update scheduled for July 1", date: "2025-06-27" },
          ],
          deadlines: [
            { title: "Monthly Report", due: "2025-07-01" },
          ],
        };
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    res.json({ role, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard summary error" });
  }
};  
