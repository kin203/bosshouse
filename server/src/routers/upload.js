import express from "express";
const router = express.Router();
import uploadCloud from "../config/cloudinary.js"
import { uploadImage } from "../controllers/index.js";

router.post('/upload', uploadCloud.array('images', 10), uploadImage)

export default router
