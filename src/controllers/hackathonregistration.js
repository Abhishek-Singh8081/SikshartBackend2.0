import HackathonRegistration from '../models/hackathonregistration.js';
import Hackathon from '../models/hackathon.model.js';

// Helper: Validate Email
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// Helper: Validate Phone
const isValidPhone = (phone) => /^\d{10}$/.test(phone);

// CREATE registration


// // Razorpay instance setup
// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Create Razorpay order for a registration
// export const createRazorpayOrder = async (req, res) => {
//   try {
//     const { registration_id } = req.body;

//     if (!registration_id) {
//       return res.status(400).json({ message: "Registration ID is required" });
//     }

//     const registration = await HackathonRegistration.findById(registration_id).populate("hackathon_id");
//     if (!registration) {
//       return res.status(404).json({ message: "Registration not found" });
//     }

//     if (!registration.is_payment_required) {
//       return res.status(400).json({ message: "Payment is not required for this registration" });
//     }

//     if (registration.payment_status === "completed") {
//       return res.status(400).json({ message: "Payment already completed" });
//     }

//     // Amount in paise (smallest currency unit)
//     const amountInPaise = registration.hackathon_id.amount_inr * 100;

//     const options = {
//       amount: amountInPaise,
//       currency: "INR",
//       receipt: `receipt_${registration._id}`,
//       payment_capture: 1, // auto capture
//     };

//     const order = await razorpayInstance.orders.create(options);

//     res.status(200).json({
//       order_id: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       registration_id: registration._id,
//     });

//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     res.status(500).json({ message: "Internal server error while creating order." });
//   }
// };


// // Verify Razorpay payment and update registration
// export const verifyPaymentAndUpdate = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       registration_id,
//       payment_mode = "razorpay"
//     } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !registration_id) {
//       return res.status(400).json({ message: "Missing required payment fields" });
//     }

//     // Verify signature
//     const crypto = await import("crypto");
//     const generated_signature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (generated_signature !== razorpay_signature) {
//       return res.status(400).json({ message: "Invalid payment signature." });
//     }

//     const registration = await HackathonRegistration.findById(registration_id).populate("hackathon_id");
//     if (!registration) {
//       return res.status(404).json({ message: "Registration not found." });
//     }

//     if (registration.payment_status === "completed") {
//       return res.status(400).json({ message: "Payment already completed for this registration." });
//     }

//     // Update registration with payment details
//     registration.payment_status = "completed";
//     registration.paid_amount = registration.hackathon_id.amount_inr;
//     registration.payment_reference = razorpay_payment_id;
//     registration.payment_mode = payment_mode;

//     await registration.save();

//     res.status(200).json({ message: "Payment verified and registration updated successfully." });

//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ message: "Server error during payment verification." });
//   }
// };




export const createHackathonRegistration = async (req, res) => {
  try {
    const {
      hackathon_id,
      is_team_registration,
      participation_type,
      individual,
      team_name,
      team_leader,
      team_members,
      why_do_you_want_to_participate,
      agree_to_terms
    } = req.body;

    // Authenticated user info from middleware
    const user_id = req.user?.id;
    const user_type = req.user?.role; // 'student' or 'freelancer'

    if (!user_id || !user_type) {
      return res.status(401).json({ message: "Unauthorized: User info missing." });
    }

    // Required fields validation
    if (!hackathon_id || !participation_type || !why_do_you_want_to_participate || agree_to_terms !== true) {
      return res.status(400).json({ message: "Missing required fields or terms not agreed." });
    }

    const validTypes = ['individual', '2', '3', '4', '5'];
    if (!validTypes.includes(participation_type)) {
      return res.status(400).json({ message: "Invalid participation type." });
    }

    const hackathon = await Hackathon.findById(hackathon_id);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found." });
    }

    if (is_team_registration) {
      // Validate team fields presence
      if (!team_name || !team_leader || !Array.isArray(team_members)) {
        return res.status(400).json({ message: "Missing team information." });
      }

      // Validate team leader fields
      const requiredLeaderFields = ['first_name', 'last_name', 'email', 'phone'];
      for (const field of requiredLeaderFields) {
        if (!team_leader[field]) {
          return res.status(400).json({ message: `Team leader ${field} is required.` });
        }
      }
      if (!isValidEmail(team_leader.email)) {
        return res.status(400).json({ message: "Invalid team leader email." });
      }
      if (!isValidPhone(team_leader.phone)) {
        return res.status(400).json({ message: "Invalid team leader phone number." });
      }

      const expectedMembers = parseInt(participation_type) - 1;
      if (team_members.length !== expectedMembers) {
        return res.status(400).json({ message: `Expected ${expectedMembers} team members.` });
      }

      // Validate team members fields
      for (let i = 0; i < team_members.length; i++) {
        const member = team_members[i];
        const requiredFields = ['first_name', 'last_name', 'email', 'phone'];
        for (const field of requiredFields) {
          if (!member[field]) {
            return res.status(400).json({ message: `Team member ${i + 1} ${field} is required.` });
          }
        }
        if (!isValidEmail(member.email)) {
          return res.status(400).json({ message: `Invalid email for team member ${i + 1}` });
        }
        if (!isValidPhone(member.phone)) {
          return res.status(400).json({ message: `Invalid phone for team member ${i + 1}` });
        }
      }

      // Set registered_by for team leader
      team_leader.registered_by = {
        user_type,
        user_id,
      };

      // Set registered_by for each team member
      team_members.forEach(member => {
        member.registered_by = {
          user_type,
          user_id,
        };
      });

    } else {
      // Individual registration validation
      if (!individual) {
        return res.status(400).json({ message: "Individual information is required." });
      }

      const requiredFields = ['first_name', 'last_name', 'email', 'phone'];
      for (const field of requiredFields) {
        if (!individual[field]) {
          return res.status(400).json({ message: `Individual ${field} is required.` });
        }
      }
      if (!isValidEmail(individual.email)) {
        return res.status(400).json({ message: "Invalid individual email." });
      }
      if (!isValidPhone(individual.phone)) {
        return res.status(400).json({ message: "Invalid individual phone number." });
      }

    
      individual.registered_by = {
        user_type,
        user_id,
      };
    }

  
    const registration = await HackathonRegistration.create({
      hackathon_id,
      participation_type,
      is_team_registration,
      individual,
      team_name,
      team_leader,
      team_members,
      why_do_you_want_to_participate,
      agree_to_terms,
    });

    res.status(201).json({
      message: "Registration successful.",
      data: registration
    });

  } catch (error) {
    console.error("Error creating registration:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};



export const getAllHackathonRegistrations = async (req, res) => {
  try {
    const registrations = await HackathonRegistration.find().populate("hackathon_id").sort({ createdAt: -1 });
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching registrations." });
  }
};


// GET single registration
export const getHackathonRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await HackathonRegistration.findById(id).populate("hackathon_id");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found." });
    }

    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({ message: "Error fetching registration." });
  }
};


// DELETE registration
export const deleteHackathonRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await HackathonRegistration.findById(id);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found." });
    }

    await registration.deleteOne();
    res.status(200).json({ message: "Registration deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting registration." });
  }
};











