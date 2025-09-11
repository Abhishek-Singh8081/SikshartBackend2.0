import cloudinary from "cloudinary";
import HackathonContact from "../models/hackathoncontact.model.js";


async function fileUploadToCloudinary(file, folder = "hackathon_contacts", type = "image") {
  return await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder,
    resource_type: type,
  });
}

const deleteFromCloudinary = async (public_id) => {
  try {
    if (public_id) {
      await cloudinary.v2.uploader.destroy(public_id);
    }
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
  }
};


export const createHackathonContact = async (req, res) => {
  try {
    const {
      query_type,
      name,
      designation,
      contact_channels
    } = req.body;

    if (!query_type || !name || !designation || !contact_channels) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Parse contact_channels if sent as string (from form data)
    let parsedContactChannels;
    if (typeof contact_channels === "string") {
      try {
        parsedContactChannels = JSON.parse(contact_channels);
      } catch (err) {
        return res.status(400).json({ message: "Invalid format for contact_channels" });
      }
    } else {
      parsedContactChannels = contact_channels;
    }

    let profileImage = {
      url: "",
      public_id: ""
    };

    // Upload image if provided
    if (req.files && req.files.profileImage) {
      const result = await fileUploadToCloudinary(req.files.profileImage, "hackathon_contacts");
      profileImage.url = result.secure_url;
      profileImage.public_id = result.public_id;
    }

    const newContact = await HackathonContact.create({
      query_type,
      name,
      designation,
      contact_channels: parsedContactChannels,
      profileImage
    });

    res.status(201).json({
      message: "Hackathon contact created successfully.",
      data: newContact
    });

  } catch (error) {
    console.error("Error creating hackathon contact:", error);
    res.status(500).json({ message: "Server error while creating contact." });
  }
};


export const getAllHackathonContacts = async (req, res) => {
  try {
    const { query_type } = req.query;

    const filters = {};
    if (query_type) filters.query_type = query_type;

    const contacts = await HackathonContact.find(filters)
      .sort({ createdAt: -1 });

    res.status(200).json(contacts);

  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error while fetching contacts." });
  }
};


export const getHackathonContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await HackathonContact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found." });
    }

    res.status(200).json(contact);

  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ message: "Server error while fetching contact." });
  }
};


export const updateHackathonContact = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Find existing contact
    const existingContact = await HackathonContact.findById(id);
    if (!existingContact) {
      return res.status(404).json({ message: "Contact not found." });
    }

    // Step 2: Parse incoming data (handle JSON strings from multipart/form-data)
    const updateData = { ...req.body };

    // Parse contact_channels if sent as string
    if (updateData.contact_channels && typeof updateData.contact_channels === "string") {
      try {
        updateData.contact_channels = JSON.parse(updateData.contact_channels);
      } catch (err) {
        return res.status(400).json({ message: "Invalid format for contact_channels" });
      }
    }

    // Step 3: Handle image upload if provided
    if (req.files && req.files.profileImage) {
      // Delete the old image if it exists
      if (existingContact.profileImage?.public_id) {
        await deleteFromCloudinary(existingContact.profileImage.public_id);
      }

      // Upload the new image
      const result = await fileUploadToCloudinary(req.files.profileImage, "hackathon_contacts");
      updateData.profileImage = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    // Step 4: Update only provided fields
    Object.keys(updateData).forEach((key) => {
      existingContact[key] = updateData[key];
    });

    // Step 5: Save updated contact
    await existingContact.save();

    res.status(200).json({
      message: "Contact updated successfully.",
      data: existingContact
    });

  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Server error while updating contact." });
  }
};


export const deleteHackathonContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await HackathonContact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found." });
    }

    // Delete Cloudinary image if present
    if (contact.profileImage?.public_id) {
      await deleteFromCloudinary(contact.profileImage.public_id);
    }

    await contact.deleteOne();

    res.status(200).json({ message: "Contact deleted successfully." });

  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Server error while deleting contact." });
  }
};
