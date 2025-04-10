import express from "express";
import { addUserAddress, deleteUserAddress, findByUserId, getAll, updateAddress } from "../controllers/usersAddress.js";
const router = express.Router();

router.get('/', getAll)
router.post('/findByUserId', findByUserId)
router.post('/add', addUserAddress)
router.patch('/update/:id', updateAddress)
router.delete('/delete/:id', deleteUserAddress)

export default router