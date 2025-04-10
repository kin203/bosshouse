import express from "express";
import { addNotification, deleteNotification, getAll, getAllToAdmin, getAllToClient, updateAllStatusNotification, updateStatusNotification } from "../controllers/notification.js";

const router = express.Router();

router.get("/", getAll);

router.get("/getAllToAdmin", getAllToAdmin);
router.get("/getAllToClient", getAllToClient);
router.post("/add", addNotification);
router.delete("/delete/:id", deleteNotification);

router.post("/updateStatusNotification", updateStatusNotification);
router.post("/updateAllStatusNotification", updateAllStatusNotification);



export default router;