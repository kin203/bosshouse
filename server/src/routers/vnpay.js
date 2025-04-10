import express from "express";
import { createPaymentUrl, vnPayQuery, vnPayReturn } from "../controllers/vnpay.js";
const router = express.Router();

router.post("/", createPaymentUrl);
router.post("/refund", vnPayReturn);
router.post("/query", vnPayQuery);

export default router;
