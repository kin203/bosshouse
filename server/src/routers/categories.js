import express from "express";
import { CategoryController } from "../controllers/index.js";
import { checkPermission } from "../middlewares/checkPermissition.js";

const router = express.Router();

router.get("/", CategoryController.getAll);

router.get("/getAllNoPaginate", CategoryController.getAllNoPaginate);

router.get("/getAllNoPaginateDetail", CategoryController.getAllNoPaginateDetail);

router.get("/:id", CategoryController.getOne);

router.post("/add", checkPermission('addCategory'), CategoryController.addCate);

router.patch("/update/:id", checkPermission('updateCategory'), CategoryController.updateCate);

router.delete("/delete/:id", checkPermission('deleteCategory'), CategoryController.deleteCate);

router.post("/deleteManyCategory", checkPermission('deleteCategory'), CategoryController.deleteManyCategory);

export default router;