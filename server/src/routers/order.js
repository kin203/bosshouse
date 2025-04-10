import express from "express";
import { checkPermission } from '../middlewares/checkPermissition.js';
import { getAllOrder, addOrder, updateOrder, deleteOrder, getAllOrderByUserId, deleteManyOrder, getAllOrderNoPaginate, getOrder, updateOrderProduct, getOrderByOrderCode } from "../controllers/order.js";

const router = express.Router();

router.get("/", getAllOrder);
router.get("/getAllOrderNoPaginate", getAllOrderNoPaginate);
router.get("/:id", getOrder);
router.post("/getOrderByOrderCode", getOrderByOrderCode);
router.post("/", getAllOrderByUserId);
router.post("/add", addOrder);
router.post("/update", updateOrder);
router.patch("/updateOrderProduct/:id", updateOrderProduct);
router.post("/delete", checkPermission('deleteOrder'), deleteOrder);
router.post("/deleteMany", checkPermission('deleteOrder'), deleteManyOrder);

export default router;
