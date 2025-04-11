import express from "express";
import cors from "cors";
import connect from "./database/index.js";
import {
  AuthRouter,
  CartRouter,
  CateRouter,
  ProductRouter,
  uploadRouter,
  mailRouter,
  orderRouter,
  blogRouter,
  voucherRouter,
  searchRouter,
  vnPayRouter,
  contactRouter,
  reviewRouter,
  roleRouter,
  soldProductRouter,
  refundRouter,
  notificationRouter,
  userAddressRouter
} from "./routers/index.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || "3001";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", ProductRouter);
app.use("/users", AuthRouter);
app.use("/category", CateRouter);
app.use("/image", uploadRouter);
app.use("/mail", mailRouter);
app.use("/cart", CartRouter);
app.use("/order", orderRouter);
app.use("/blog", blogRouter);
app.use("/voucher", voucherRouter);
app.use("/search", searchRouter);
app.use("/vnpay", vnPayRouter);
app.use("/contact", contactRouter);
app.use("/review", reviewRouter);
app.use("/review", reviewRouter);
app.use("/role", roleRouter);
app.use("/soldProduct", soldProductRouter);
app.use("/refundHistory", refundRouter);
app.use("/notification", notificationRouter);
app.use("/userAddress", userAddressRouter);

app.listen(7000, async () => {
  await connect();
  console.log(`Example app listening on port 7000`);
});
