import express from "express";
import { VoucherController } from "../controllers/index.js";
import { checkPermission } from "../middlewares/checkPermissition.js";
import { deleteVoucherFromAdmin, getVoucherByUserId, updateApplyVoucher, updateVoucherFromAdmin, userAddVoucher } from "../controllers/voucher.js";

const router = express.Router();

router.get("/", VoucherController.getAll);

router.get("/:id", VoucherController.getOne);

router.post("/add", checkPermission('addVoucher'), VoucherController.addVoucher);

router.put("/update/:id", checkPermission('updateVoucher'), VoucherController.updateVoucher);

router.delete("/delete/:id", checkPermission('deleteVoucher'), VoucherController.deleteVoucher);

router.post("/applyVoucher", VoucherController.applyVoucher);

// Client
router.post("/userAdd", userAddVoucher);
router.post("/getVoucherByUserId", getVoucherByUserId);
router.post("/updateApplyVoucher", updateApplyVoucher);

//admin
router.post("/updateVoucherFromAdmin", checkPermission('updateVoucher'), updateVoucherFromAdmin);
router.post("/deleteVoucherFromAdmin", checkPermission('deleteVoucher'), deleteVoucherFromAdmin);

export default router;
