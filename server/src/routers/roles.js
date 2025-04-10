import express from "express";
import { CategoryController } from "../controllers/index.js";
import { checkPermission } from "../middlewares/checkPermissition.js";
import { addRole, deleteRole, getAll, getOne, updateRole } from "../controllers/roles.js";

const router = express.Router();

router.get("/", getAll);

router.get("/:id", getOne);

router.post("/add", addRole);

router.patch("/update/:id", updateRole);

router.delete("/delete/:id", deleteRole);

// router.post("/deleteManyCategory", checkPermission, CategoryController.deleteManyCategory);

export default router;