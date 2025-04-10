import express from "express";
import { ProductsController } from "../controllers/index.js";
import { checkPermission } from "../middlewares/checkPermissition.js";

const router = express.Router();

router.get("/", ProductsController.getAllProduct);

router.get("/getProductsNoPaginate", ProductsController.getAllProductNoPaginate);

router.get("/:id", ProductsController.getOneProduct);

router.post("/add", checkPermission('addProduct'), ProductsController.addProduct);

router.patch("/update/:id", checkPermission('updateProduct'), ProductsController.updateProduct);

router.patch("/updateActive/:id", checkPermission('updateProduct'), ProductsController.updateActive);

router.delete("/delete/:id", checkPermission('deleteProduct'), ProductsController.deleteProduct);

router.post("/deleteMany", checkPermission('deleteProduct'), ProductsController.deleteManyProduct);

router.post("/updateManyQuantity", ProductsController.updateManyQuantity);

export default router;