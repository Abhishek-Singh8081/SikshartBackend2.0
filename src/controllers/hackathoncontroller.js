import cloudinary from 'cloudinary';
import Hackathon from "../models/hackathon.model.js";
import College from "../models/college.model.js";

async function fileUploadToCloudinary(file, folder, type) {
  return await cloudinary.uploader.upload(file.tempFilePath, {
    folder,
    resource_type: type, 
  });
}

const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
  }
};



export const createHackathon = async (req, res) => {
  try {
    const {
      name,
      event_type,
      description,
      website,
      benefits,
      conducted_by,
      hackathon_dates,
      league_format,
      prize_pool,
      hackathon_type,
      is_paid,
      amount,
      location,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !event_type ||
      !description ||
      !conducted_by ||
      !hackathon_dates ||
      !hackathon_type ||
      typeof is_paid === 'undefined'
    ) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    if (!['online', 'offline', 'hybrid'].includes(hackathon_type)) {
      return res.status(400).json({ message: 'Invalid hackathon type.' });
    }

    if (!['hackathon', 'ideathon', 'incubation'].includes(event_type)) {
      return res.status(400).json({ message: 'Invalid event type.' });
    }

    if ((is_paid === 'true' || is_paid === true) && (!amount || isNaN(Number(amount)) || Number(amount) < 0)) {
      return res.status(400).json({ message: 'Amount must be a non-negative number if hackathon is paid.' });
    }

    if ((hackathon_type === 'offline' || hackathon_type === 'hybrid') && !location) {
      return res.status(400).json({ message: 'Location is required for offline or hybrid hackathons.' });
    }

    // Validate poster image presence
    if (!req.files || !req.files.poster_image) {
      return res.status(400).json({ message: 'Poster image is required.' });
    }

    // Upload poster image
    const posterUpload = await fileUploadToCloudinary(req.files.poster_image, 'hackathons', 'image');

    // Parse conducted_by array
    let collegeIds = [];
    try {
      collegeIds = typeof conducted_by === 'string' ? JSON.parse(conducted_by) : conducted_by;
    } catch {
      return res.status(400).json({ message: 'Invalid JSON format for conducted_by.' });
    }
    if (!Array.isArray(collegeIds) || collegeIds.length === 0) {
      return res.status(400).json({ message: 'conducted_by must be a non-empty array of college IDs.' });
    }

    const validColleges = await College.find({ _id: { $in: collegeIds } });
    if (validColleges.length !== collegeIds.length) {
      return res.status(400).json({ message: 'One or more college IDs are invalid.' });
    }

    // Parse benefits
    let benefitsArr = [];
    if (benefits) {
      if (typeof benefits === 'string') {
        try {
          benefitsArr = JSON.parse(benefits);
          if (!Array.isArray(benefitsArr)) throw new Error();
        } catch {
          return res.status(400).json({ message: 'Benefits must be an array or JSON string.' });
        }
      } else if (Array.isArray(benefits)) {
        benefitsArr = benefits;
      } else {
        return res.status(400).json({ message: 'Benefits must be an array or JSON string.' });
      }
    }

    // Parse hackathon_dates, league_format, prize_pool
    let parsedDates, parsedLeagueFormat, parsedPrizePool;
    try {
      parsedDates = typeof hackathon_dates === 'string' ? JSON.parse(hackathon_dates) : hackathon_dates;
      parsedLeagueFormat = league_format ? (typeof league_format === 'string' ? JSON.parse(league_format) : league_format) : [];
      parsedPrizePool = prize_pool ? (typeof prize_pool === 'string' ? JSON.parse(prize_pool) : prize_pool) : [];
    } catch {
      return res.status(400).json({ message: 'Invalid JSON format for dates, league format, or prize pool.' });
    }

    // Create hackathon document
    const newHackathon = await Hackathon.create({
      name,
      event_type,
      description,
      website,
      hackathon_type,
      is_paid: is_paid === 'true' || is_paid === true,
      amount_inr: (is_paid === 'true' || is_paid === true) ? Number(amount) : 0,
      location: (hackathon_type === 'offline' || hackathon_type === 'hybrid') ? location : undefined,
      poster_image: {
        url: posterUpload.secure_url,
        public_id: posterUpload.public_id,
      },
      benefits: benefitsArr.map(text => ({ text })),
      conducted_by: collegeIds,
      hackathon_dates: parsedDates,
      league_format: parsedLeagueFormat,
      prize_pool: parsedPrizePool,
    });

    return res.status(201).json(newHackathon);
  } catch (error) {
    console.error('Hackathon creation error:', error);
    return res.status(500).json({ message: 'Server error during hackathon creation.' });
  }
};






export const getAllHackathons = async (req, res) => {
  try {
    const { type } = req.query;

    const filter = {};
    if (type && ["hackathon", "ideathon", "techfest"].includes(type)) {
      filter.event_type = type;
    }

    const hackathons = await Hackathon.find(filter)
      .sort({ createdAt: -1 })
      .populate("conducted_by");

    res.status(200).json(hackathons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hackathons." });
  }
};



export const getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id).populate("conducted_by");

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    res.status(200).json(hackathon);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hackathon." });
  }
};




export const updateHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    const {
      name,
      event_type,
      description,
      website,
      benefits,
      conducted_by,
      hackathon_dates,
      league_format,
      prize_pool,
      hackathon_type,
      is_paid,
      amount,
      location,
    } = req.body;
    // console.log(location)

    // Poster image update
    if (req.files?.poster_image) {
      if (hackathon.poster_image?.public_id) {
        await deleteFromCloudinary(hackathon.poster_image.public_id);
      }
      const posterUpload = await fileUploadToCloudinary(req.files.poster_image, 'hackathons', 'image');
      hackathon.poster_image = {
        url: posterUpload.secure_url,
        public_id: posterUpload.public_id,
      };
    }

    // Basic field updates
    if (name) hackathon.name = name;
    if (description) hackathon.description = description;
    if (website) hackathon.website = website;

    // Event type validation + update
    if (event_type) {
      if (!['hackathon', 'ideathon', 'incubation'].includes(event_type)) {
        return res.status(400).json({ message: 'Invalid event type.' });
      }
      hackathon.event_type = event_type;
    }

    // Hackathon type + location logic
    if (hackathon_type) {
      if (!['online', 'offline', 'hybrid'].includes(hackathon_type)) {
        return res.status(400).json({ message: 'Invalid hackathon type.' });
      }
      hackathon.hackathon_type = hackathon_type;

      if (hackathon_type === 'online') {
        hackathon.location = undefined;
      } else if (location) {
        hackathon.location = location;
      } else {
        return res.status(400).json({ message: 'Location is required for offline or hybrid hackathons.' });
      }
    } else if ((hackathon.hackathon_type === 'offline' || hackathon.hackathon_type === 'hybrid') && location) {
      hackathon.location = location;
    }

    
    // Payment handling
    if (typeof is_paid !== 'undefined') {
      const paidBool = is_paid === 'true' || is_paid === true;
      hackathon.is_paid = paidBool;

      if (paidBool) {
        const numericAmount = Number(amount);
        if (!amount || isNaN(numericAmount) || numericAmount < 0) {
          return res.status(400).json({ message: 'Amount must be a valid non-negative number.' });
        }
        hackathon.amount_inr = numericAmount;
      } else {
        hackathon.amount_inr = 0;
      }
    }

    // Benefits update
    if (benefits) {
      let benefitsArr = [];
      if (typeof benefits === 'string') {
        try {
          benefitsArr = JSON.parse(benefits);
          if (!Array.isArray(benefitsArr)) {
            return res.status(400).json({ message: 'Benefits must be an array.' });
          }
        } catch {
          return res.status(400).json({ message: 'Invalid format for benefits.' });
        }
      } else if (Array.isArray(benefits)) {
        benefitsArr = benefits;
      } else {
        return res.status(400).json({ message: 'Benefits must be an array or JSON string.' });
      }
      hackathon.benefits = benefitsArr.map(text => ({ text }));
    }

    // Conducted By update
    if (conducted_by) {
      let collegeIds = [];
      try {
        collegeIds = typeof conducted_by === 'string' ? JSON.parse(conducted_by) : conducted_by;
      } catch {
        return res.status(400).json({ message: 'Invalid JSON format for conducted_by.' });
      }

      if (!Array.isArray(collegeIds) || collegeIds.length === 0) {
        return res.status(400).json({ message: 'conducted_by must be a non-empty array of college IDs.' });
      }

      const validColleges = await College.find({ _id: { $in: collegeIds } });
      if (validColleges.length !== collegeIds.length) {
        return res.status(400).json({ message: 'One or more college IDs are invalid.' });
      }

      hackathon.conducted_by = collegeIds;
    }

    // Hackathon dates update
    if (hackathon_dates) {
      let parsedDates;
      try {
        parsedDates = typeof hackathon_dates === 'string' ? JSON.parse(hackathon_dates) : hackathon_dates;
      } catch {
        return res.status(400).json({ message: 'Invalid format for hackathon_dates.' });
      }
      hackathon.hackathon_dates = {
        ...hackathon.hackathon_dates,
        ...parsedDates,
      };
    }

    // League format update
    if (league_format) {
      let parsedLeague;
      try {
        parsedLeague = typeof league_format === 'string' ? JSON.parse(league_format) : league_format;
      } catch {
        return res.status(400).json({ message: 'Invalid format for league_format.' });
      }
      hackathon.league_format = parsedLeague;
    }

    // Prize pool update
    if (prize_pool) {
      let parsedPrize;
      try {
        parsedPrize = typeof prize_pool === 'string' ? JSON.parse(prize_pool) : prize_pool;
      } catch {
        return res.status(400).json({ message: 'Invalid format for prize_pool.' });
      }
      hackathon.prize_pool = parsedPrize;
    }

    await hackathon.save();

    return res.status(200).json(hackathon);
  } catch (error) {
    console.error('Update Hackathon Error:', error);
    return res.status(500).json({ message: 'Error updating hackathon.' });
  }
};



export const deleteHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    await deleteFromCloudinary(hackathon.poster_image.public_id);
    await deleteFromCloudinary(hackathon.conducted_by.collage_image.public_id);

    await hackathon.deleteOne();
    res.status(200).json({ message: "Hackathon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting hackathon." });
  }
};

export const addBenefit = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Benefit text is required." });

    const hackathon = await Hackathon.findById(req.params.id);
    hackathon.benefits.push({ text });
    await hackathon.save();

    res.status(200).json(hackathon);
  } catch (error) {
    res.status(500).json({ message: "Error adding benefit." });
  }
};

export const deleteBenefit = async (req, res) => {
  try {
    const { benefitId } = req.params;
    const hackathon = await Hackathon.findById(req.params.id);
    hackathon.benefits.id(benefitId).remove();
    await hackathon.save();

    res.status(200).json(hackathon);
  } catch (error) {
    res.status(500).json({ message: "Error deleting benefit." });
  }
};

export const addPrizePool = async (req, res) => {
  try {
    const { id } = req.params;
    const { rank, description, amount_inr, amount_usd, teams_selected } = req.body;

    if (!rank || !description || !amount_inr) {
      return res.status(400).json({ message: "Required fields: rank, description, amount_inr" });
    }

    const hackathon = await Hackathon.findById(id);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    hackathon.prize_pool.push({ rank, description, amount_inr, amount_usd, teams_selected });
    await hackathon.save();

    res.status(200).json(hackathon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add prize pool entry" });
  }
};

export const deletePrizePool = async (req, res) => {
  try {
    const { id, prizeId } = req.params;

    const hackathon = await Hackathon.findById(id);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    const item = hackathon.prize_pool.id(prizeId);
    if (!item) return res.status(404).json({ message: "Prize entry not found" });

    item.remove();
    await hackathon.save();

    res.status(200).json(hackathon);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete prize entry" });
  }
};

export const addLeagueFormat = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, start_datetime, end_datetime, description } = req.body;

    if (!stage || !start_datetime || !end_datetime || !description) {
      return res.status(400).json({ message: "All fields are required for league format." });
    }

    const hackathon = await Hackathon.findById(id);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    hackathon.league_format.push({ stage, start_datetime, end_datetime, description });
    await hackathon.save();

    res.status(200).json(hackathon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add league format entry" });
  }
};

export const deleteLeagueFormat = async (req, res) => {
  try {
    const { id, leagueId } = req.params;

    const hackathon = await Hackathon.findById(id);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    const item = hackathon.league_format.id(leagueId);
    if (!item) return res.status(404).json({ message: "League format entry not found" });

    item.remove();
    await hackathon.save();

    res.status(200).json(hackathon);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete league format entry" });
  }
};




