import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  createCheckoutSession,
  confirmPayment,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
} from "../controller/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, admin, getAllOrders);

router.route("/myorders").get(protect, getMyOrders);

router.route("/:id").get(protect, getOrderById);

// Stripe payment routes
router
  .route("/:id/create-checkout-session")
  .post(protect, createCheckoutSession);
router.route("/:id/confirm-payment").put(protect, confirmPayment);

// Legacy payment route
router.route("/:id/pay").put(protect, updateOrderToPaid);

router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
