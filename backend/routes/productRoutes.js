import express from "express";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { adminProtect, protect } from "../middleware/protect.js";
const router = express.Router();

//Get products
router.route("/").get(getProducts).post(protect, adminProtect, createProduct);

//Get Single Product
router
  .route("/:id")
  .get(getProductById)
  .put(protect, adminProtect, updateProduct)
  .delete(protect, adminProtect, deleteProduct);

//Review
router.route("/:id/review").post(protect, createProductReview);

export default router;
