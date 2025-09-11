import cloudinary from "cloudinary";
import Company from "../models/companyModel.js";
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


export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const { files } = req;

    
    if (files?.image) {
      if (company.image?.public_id) {
        await deleteFromCloudinary(company.image.public_id);
      }
      const uploadedImage = await fileUploadToCloudinary(files.image, "company_images");
      company.image = {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    
    if (files?.companylogo) {
      if (company.companylogo?.public_id) {
        await deleteFromCloudinary(company.companylogo.public_id);
      }
      const uploadedLogo = await fileUploadToCloudinary(files.companylogo, "company_logos");
      company.companylogo = {
        url: uploadedLogo.secure_url,
        public_id: uploadedLogo.public_id,
      };
    }

    
    const updatableFields = [
      "name", "email", "phone", "industry", "companySize", "website",
      "address", "description", "isSponser", "isVerified", "isActive"
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
      }
    });

    await company.save();
    res.status(200).json({ message: "Company updated successfully", company });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });


    if (company.image?.public_id) await deleteFromCloudinary(company.image.public_id);
    if (company.companylogo?.public_id) await deleteFromCloudinary(company.companylogo.public_id);

    await Company.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const getAllCompanies = async (req, res) => {
  try {
    const { isActive, isVerified } = req.query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (isVerified !== undefined) filter.isVerified = isVerified === "true";

    const companies = await Company.find(filter);
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
