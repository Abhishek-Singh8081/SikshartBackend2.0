import { Router } from "express";
import {
  createBlog,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
  getAllBlogs,
} from "../controllers/blog.controller.js";

const router = Router();

router.post("/", createBlog);
router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.get("/id/:id", getBlogById);

export default router;
