import express from "express";
import { addReview, findReview, getAllReviewByProductId, getAllReviewNoPaginate } from "../controllers/review.js";

const router = express.Router();

router.get("/", getAllReviewNoPaginate);

router.post("/", getAllReviewByProductId);

router.post("/findReview", findReview);

router.post("/add", addReview);

// router.patch("/update/:id", checkPermission, BlogController.updateBlog);

// router.delete("/delete/:id", checkPermission, BlogController.deleteBlog);

export default router;
