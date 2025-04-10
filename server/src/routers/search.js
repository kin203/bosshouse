import express from "express";
import { search } from "../controllers/index.js";
const router = express.Router();

router.post("/", search);

export default router;
