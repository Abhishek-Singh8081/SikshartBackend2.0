import Media from "../models/hackathongallery.model.js"
import cloudinary from "cloudinary"
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
export const getMedia = async (req, res) => {
  try {
    let media = await Media.findOne();
    if (!media) media = await Media.create({});
    res.status(200).json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateImageByPublicId = async (req, res) => {
  try {
    const { public_id } = req.body;
    const file = req.files?.image;

    if (!file || !public_id) {
      return res.status(400).json({ message: "Image file and public_id are required." });
    }

    let media = await Media.findOne();
    if (!media) return res.status(404).json({ message: "Media not found." });

    // Find image by public_id
    const index = media.images.findIndex((img) => img.public_id === public_id);
    if (index === -1) {
      return res.status(404).json({ message: "Image not found with provided public_id." });
    }

    // Delete old image from Cloudinary
    await deleteFromCloudinary(public_id);

    // Upload new image
    const uploaded = await fileUploadToCloudinary(file, "hackathon_images", "image");

    // Replace image in DB
    media.images[index] = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    };

    await media.save();

    res.status(200).json({
      message: "Image updated successfully.",
      updatedImage: media.images[index],
    });
  } catch (err) {
    console.error("Error updating image by public_id:", err);
    res.status(500).json({ message: "Failed to update image." });
  }
};

export const updateVideoByPublicId = async (req, res) => {
  try {
    const { public_id } = req.body;
    const file = req.files?.video;

    if (!file || !public_id) {
      return res.status(400).json({ message: "Video file and public_id are required." });
    }

    let media = await Media.findOne();
    if (!media || !media.video?.public_id) {
      return res.status(404).json({ message: "No video found to update." });
    }

    if (media.video.public_id !== public_id) {
      return res.status(400).json({ message: "Provided public_id does not match existing video." });
    }

    // Delete old video
    await deleteFromCloudinary(public_id);

    // Upload new video
    const uploaded = await fileUploadToCloudinary(file, "hackathon_videos", "video");

    // Update in DB
    media.video = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    };

    await media.save();

    res.status(200).json({
      message: "Video updated successfully.",
      video: media.video,
    });
  } catch (err) {
    console.error("Error updating video by public_id:", err);
    res.status(500).json({ message: "Failed to update video." });
  }
};


// ========== Upload SINGLE IMAGE ==========
export const uploadSingleImage = async (req, res) => {
  try {
    const file = req.files?.image;
    if (!file) {
      return res.status(400).json({ message: "No image file uploaded." });
    }

    // Upload image
    const uploaded = await fileUploadToCloudinary(file, "hackathon_images", "image");

    // Ensure media doc exists
    let media = await Media.findOne();
    if (!media) media = await Media.create({});

    // Push new image
    media.images.push({
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    });

    await media.save();

    res.status(201).json({
      message: "Image uploaded successfully",
      image: uploaded.secure_url,
      media,
    });
  } catch (err) {
    console.error("Error uploading single image:", err);
    res.status(500).json({ message: "Failed to upload image." });
  }
};
// ========== Upload SINGLE VIDEO ==========
export const uploadSingleVideo = async (req, res) => {
  try {
    const file = req.files?.video;
    if (!file) {
      return res.status(400).json({ message: "No video file uploaded." });
    }

    const uploaded = await fileUploadToCloudinary(file, "hackathon_videos", "video");

    let media = await Media.findOne();
    if (!media) media = await Media.create({});

    media.video = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    };

    await media.save();

    res.status(201).json({
      message: "Video uploaded successfully",
      video: uploaded.secure_url,
      media,
    });
  } catch (err) {
    console.error("Error uploading single video:", err);
    res.status(500).json({ message: "Failed to upload video." });
  }
};
