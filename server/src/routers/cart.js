import express from "express";
import {
  addToCart,
  deleteProductCartFromAdmin,
  getAllCart,
  getCartByUserId,
  removeCartItem,
  updateCartByUserId,
  updateProductCartFromAdmin,
} from "../controllers/cart.js";

const router = express.Router();

router.get("/", getAllCart);
router.post("/getCartByUserId", getCartByUserId);
router.post("/add", addToCart);
router.post("/updateCartByUserId", updateCartByUserId);
router.post("/deleteCart", removeCartItem);
router.post("/updateProductCartFromAdmin", updateProductCartFromAdmin);
router.post("/deleteProductCartFromAdmin", deleteProductCartFromAdmin);

export default router;