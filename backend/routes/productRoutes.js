import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from "../controller/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.get("/", getProducts);
router.get("/top", getTopProducts); // New route for top products
router.get("/:id", getProductById);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.post("/:id/reviews", protect, createProductReview);

export default router;
