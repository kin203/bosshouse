import express from "express";
import { addSoldProduct, getAll, getOne } from "../controllers/soldProducts.js";

const router = express.Router();

router.get("/", getAll);
router.post("/add", addSoldProduct);
router.post("/getProductId", getOne);

export default router;