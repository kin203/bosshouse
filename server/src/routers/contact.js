import express from "express";
import { ContactController } from "../controllers/index.js";
import { checkPermission } from "../middlewares/checkPermissition.js";

const router = express.Router();

router.get("/", ContactController.getAll);
router.get("/getAllNoPaginate", ContactController.getAllNoPaginate);

router.get("/:id", ContactController.getOne);

router.post("/add", ContactController.addContact);

router.delete("/delete/:id", checkPermission('deleteContact'), ContactController.deleteContact);

router.post("/deleteMany", checkPermission('deleteContact'), ContactController.deleteManyContact);

router.patch("/updateProcessed/:id", checkPermission('updateContact'), ContactController.updateProcessed);

export default router;