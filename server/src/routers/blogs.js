import express from "express";
import { checkPermission } from "../middlewares/checkPermissition.js";
import { BlogController } from "../controllers/index.js";

const router = express.Router();

router.get("/", BlogController.getAllBlogs);
router.get("/getAllBlogNoPaginate", BlogController.getAllBlogNoPaginate);

router.get("/:id", BlogController.getOneBlog);

router.post("/add", checkPermission('addBlog'), BlogController.addBlog);

router.patch("/update/:id", checkPermission('updateBlog'), BlogController.updateBlog);

router.delete("/delete/:id", checkPermission('deleteBlog'), BlogController.deleteBlog);

export default router;
