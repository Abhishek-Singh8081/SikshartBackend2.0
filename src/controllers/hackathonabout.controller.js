import AboutPage from "../models/hackathonabout.model.js";
import cloudinary from "cloudinary";

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
// 1. Get the About Page (only one expected)
export const getAboutPage = async (req, res) => {
  try {
    const aboutPage = await AboutPage.findOne();
    if (!aboutPage) return res.status(404).json({ message: "About page not found" });
    res.status(200).json(aboutPage);
  } catch (error) {
    console.error("Get AboutPage Error:", error);
    res.status(500).json({ message: "Server error fetching About page" });
  }
};

// 2. Create or Initialize About Page (only once)
export const createAboutPage = async (req, res) => {
  try {
    const existing = await AboutPage.findOne();
    if (existing) {
      return res.status(400).json({ message: "About page already exists" });
    }

    const {
      headline,
      intro,
      metaTitle,
      metaDescription,
      sections,
    } = req.body;

    if (!headline || !intro) {
      return res.status(400).json({ message: "headline and intro are required" });
    }

    let banner_image = null;

    if (req.files?.banner_image) {
      const uploadedBanner = await fileUploadToCloudinary(req.files.banner_image, 'about_page/banner', 'image');
      banner_image = {
        url: uploadedBanner.secure_url,
        public_id: uploadedBanner.public_id,
        alt: req.body.banner_image_alt || '',
      };
    }

    let parsedSections = [];

    if (Array.isArray(sections)) {
      parsedSections = sections;
    } else if (typeof sections === "string") {
      try {
        parsedSections = JSON.parse(sections);
      } catch (e) {
        console.error("Invalid sections JSON:", e);
        return res.status(400).json({ message: "Invalid sections format" });
      }
    }

    const aboutPage = new AboutPage({
      headline,
      intro,
      banner_image,
      metaTitle,
      metaDescription,
      sections: parsedSections,
    });

    await aboutPage.save();
    res.status(201).json(aboutPage);
  } catch (error) {
    console.error("Create AboutPage Error:", error);
    res.status(500).json({ message: "Server error creating About page" });
  }
};



// 3. Update About Page general info (headline, intro, banner, meta)

export const updateAboutPage = async (req, res) => {
  try {
    const aboutPage = await AboutPage.findOne();
    if (!aboutPage) {
      return res.status(404).json({ message: "About page not found" });
    }

    // ✅ Check if req.body exists before destructuring
    const body = req.body || {};

    const {
      headline,
      intro,
      metaTitle,
      metaDescription,
      banner_image_alt,
    } = body;

    if (headline) aboutPage.headline = headline;
    if (intro) aboutPage.intro = intro;
    if (metaTitle) aboutPage.metaTitle = metaTitle;
    if (metaDescription) aboutPage.metaDescription = metaDescription;

    // ✅ Handle banner_image upload (if using express-fileupload or multer)
    if (req.files?.banner_image) {
      // Delete existing image from Cloudinary
      if (aboutPage.banner_image?.public_id) {
        await deleteFromCloudinary(aboutPage.banner_image.public_id);
      }

      // Upload new image
      const uploadedBanner = await fileUploadToCloudinary(
        req.files.banner_image,
        "about_page/banner",
        "image"
      );

      aboutPage.banner_image = {
        url: uploadedBanner.secure_url,
        public_id: uploadedBanner.public_id,
        alt: banner_image_alt || aboutPage.banner_image?.alt || "",
      };
    }

    await aboutPage.save();
    res.status(200).json(aboutPage);
  } catch (error) {
    console.error("Update AboutPage Error:", error);
    res.status(500).json({ message: "Server error updating About page" });
  }
};


// 4. Add a new section
export const addSection = async (req, res) => {
  try {
    const aboutPage = await AboutPage.findOne();
    if (!aboutPage) return res.status(404).json({ message: "About page not found" });

    const {
      slug,
      title,
      content,
      icon,
      visible,
    } = req.body;

    if (!slug || !title || !content) {
      return res.status(400).json({ message: "slug, title, and content are required" });
    }

    // Check if slug already exists in sections
    const exists = aboutPage.sections.some(section => section.slug === slug);
    if (exists) {
      return res.status(400).json({ message: "Section with this slug already exists" });
    }

    aboutPage.sections.push({
      slug,
      title,
      content,
      icon,
      visible: typeof visible === "boolean" ? visible : true,
    });

    await aboutPage.save();
    res.status(201).json(aboutPage);
  } catch (error) {
    console.error("Add Section Error:", error);
    res.status(500).json({ message: "Server error adding section" });
  }
};

// 5. Update a section by slug
export const updateSection = async (req, res) => {
  try {
    const { slug } = req.params;
    const aboutPage = await AboutPage.findOne();
    if (!aboutPage) return res.status(404).json({ message: "About page not found" });

    const section = aboutPage.sections.find(sec => sec.slug === slug);
    if (!section) return res.status(404).json({ message: "Section not found" });

    const {
      title,
      content,
      icon,
      visible,
      newSlug,
    } = req.body;

    if (title) section.title = title;
    if (content) section.content = content;
    if (icon !== undefined) section.icon = icon;
    if (visible !== undefined) section.visible = visible;
    if (newSlug && newSlug !== slug) {
      // Ensure newSlug is unique
      if (aboutPage.sections.some(sec => sec.slug === newSlug)) {
        return res.status(400).json({ message: "Another section with newSlug already exists" });
      }
      section.slug = newSlug;
    }

    await aboutPage.save();
    res.status(200).json(aboutPage);
  } catch (error) {
    console.error("Update Section Error:", error);
    res.status(500).json({ message: "Server error updating section" });
  }
};

// 6. Delete a section by slug
export const deleteSection = async (req, res) => {
  try {
    const { slug } = req.params;
    const aboutPage = await AboutPage.findOne();
    if (!aboutPage) return res.status(404).json({ message: "About page not found" });

    const sectionIndex = aboutPage.sections.findIndex(sec => sec.slug === slug);
    if (sectionIndex === -1) return res.status(404).json({ message: "Section not found" });

    aboutPage.sections.splice(sectionIndex, 1);

    await aboutPage.save();
    res.status(200).json({ message: "Section deleted successfully", aboutPage });
  } catch (error) {
    console.error("Delete Section Error:", error);
    res.status(500).json({ message: "Server error deleting section" });
  }
};

// 7. Toggle Section Visibility by slug
export const toggleSectionVisibility = async (req, res) => {
  try {
    const { slug } = req.params;
    const aboutPage = await AboutPage.findOne();
    if (!aboutPage) return res.status(404).json({ message: "About page not found" });

    const section = aboutPage.sections.find(sec => sec.slug === slug);
    if (!section) return res.status(404).json({ message: "Section not found" });

    section.visible = !section.visible;

    await aboutPage.save();
    res.status(200).json({ message: `Section visibility toggled to ${section.visible}`, section });
  } catch (error) {
    console.error("Toggle Section Visibility Error:", error);
    res.status(500).json({ message: "Server error toggling section visibility" });
  }
};
