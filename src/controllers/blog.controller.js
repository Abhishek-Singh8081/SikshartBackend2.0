// Make sure this path is correct based on where your model file is
import mongoose from "mongoose"; // Import mongoose for error handling
import Blog from "../models/blog.model.js"; // Import your Blog model

// IMPORTANT: In a real application, ensure you have a database connection
// established before these functions are called.
// e.g., import dbConnect from '@/lib/dbConnect';
// and call await dbConnect(); at the start of your API routes.

/**
 * Creates a new blog post.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
async function createBlog(req, res) {
  try {
    // Destructure all required fields from req.body based on your schema.
    // Ensure the client sends all necessary data.
    const {
      title,
      slug, // Slug is required and unique, so it should ideally come from the client or be generated here.
      heroImageUrl,
      altText,
      category,
      tags,
      author,
      excerpt,
      content,
      readingTimeMinutes,
      isFeatured,
      views, // Can be omitted if default is desired
    } = req.body;

    const newBlog = await Blog.create({
      title,
      slug,
      heroImageUrl,
      altText,
      category,
      tags,
      author,
      excerpt,
      content,
      readingTimeMinutes,
      isFeatured,
      views,
    });

    res.status(201).json(newBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    // Handle Mongoose validation errors specifically
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(400)
        .json({ error: error.message, details: error.errors });
    }
    // Handle duplicate key errors (e.g., for unique slug)
    if (error.code === 11000) {
      return res.status(409).json({
        error: "Duplicate key error: A blog with this slug already exists.",
      });
    }
    res
      .status(500)
      .json({ error: "Failed to create blog post.", errormsg: error.message });
  }
}

/**
 * Retrieves all blog posts.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
async function getAllBlogs(req, res) {
  try {
    // Mongoose uses .find({}) to get all documents
    const blogs = await Blog.find({});
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error getting all blogs:", error);
    res.status(500).json({ error: "Failed to retrieve blog posts." });
  }
}

/**
 * Retrieves a single blog post by its slug
 * @param {object} req - Express request object (expects req.params.id).
 * @param {object} res - Express response object.
 */
async function getBlogBySlug(req, res) {
  try {
    const { slug } = req.params;
    // Mongoose uses .findOne({ slug: slug }) to find a document by its slug
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error getting blog by ID:", error);
    // Check if the ID format is invalid (e.g., not a valid ObjectId)
    if (error instanceof mongoose.Error.CastError && error.path === "_id") {
      return res.status(400).json({ error: "Invalid blog slug format." });
    }
    res.status(500).json({ error: "Failed to retrieve blog post." });
  }
}

/**
 * Retrieves a single blog post by its id.
 * @param {object} req - Express request object (expects req.params.id).
 * @param {object} res - Express response object.
 */
async function getBlogById(req, res) {
  try {
    const { id } = req.params;
    console.log(id);
    const blog = await Blog.findById(id);
    console.log(blog);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error getting blog by ID:", error);
    // Check if the ID format is invalid (e.g., not a valid ObjectId)
    if (error instanceof mongoose.Error.CastError && error.path === "_id") {
      return res.status(400).json({ error: "Invalid blog ID format." });
    }
    res.status(500).json({ error: "Failed to retrieve blog post." });
  }
}

/**
 * Updates an existing blog post by its ID.
 * @param {object} req - Express request object (expects req.params.id and req.body for updates).
 * @param {object} res - Express response object.
 */
async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body; // Get all updates from the request body

    // Use findByIdAndUpdate to find and update in one go.
    // { new: true } returns the updated document.
    // { runValidators: true } ensures schema validators are run on update.
    const blog = await Blog.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error updating blog:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(400)
        .json({ error: error.message, details: error.errors });
    }
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(409).json({
        error: "Duplicate key error: The updated slug already exists.",
      });
    }
    if (error instanceof mongoose.Error.CastError && error.path === "_id") {
      return res.status(400).json({ error: "Invalid blog ID format." });
    }
    res.status(500).json({ error: "Failed to update blog post." });
  }
}

/**
 * Deletes a blog post by its ID.
 * @param {object} req - Express request object (expects req.params.id).
 * @param {object} res - Express response object.
 */
async function deleteBlog(req, res) {
  try {
    const { id } = req.params;
    // Mongoose uses .findByIdAndDelete() to find and delete
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }
    // 204 No Content is standard for successful deletion
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting blog:", error);
    if (error instanceof mongoose.Error.CastError && error.path === "_id") {
      return res.status(400).json({ error: "Invalid blog ID format." });
    }
    res.status(500).json({ error: "Failed to delete blog post." });
  }
}

export {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
};
