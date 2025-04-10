import express from "express";
import { addRefund, getAllRefund, getOne } from "../controllers/refundHistory.js";

const router = express.Router();

router.get('/', getAllRefund)
router.get('/:id', getOne)
router.post('/addRefund', addRefund)

export default router