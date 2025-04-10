import express from "express";
import { AuthController } from "../controllers/index.js";
import { checkPermission } from "../middlewares/checkPermissition.js";

const router = express.Router();

router.post("/signup", AuthController.signup);

router.post("/signin", AuthController.signin);

router.get("/", AuthController.getAll);

router.get("/getAllNoPaginate", AuthController.getAllNoPaginate);

router.post("/getByEmail", AuthController.getByEmail);

router.post("/fogotpassword", AuthController.fogotPassword);

router.get("/:id", AuthController.getOne);

router.patch("/updateUser/:id", AuthController.updateUser);

router.delete("/deleteUser/:id", checkPermission('deleteUser'), AuthController.deleteUser);

router.post("/deleteManyUser", checkPermission('deleteUser'), AuthController.deleteManyUser);


export default router;