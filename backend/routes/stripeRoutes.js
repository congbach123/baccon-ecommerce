import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";
import stripe from "../config/stripe.js";
import Order from "../models/orderModel.js";

const router = express.Router();

// @desc    Create payment intent
// @route   POST /api/stripe/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to access this order");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Order already paid");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // Stripe uses cents
    currency: "usd",
    metadata: {
      orderId: order._id.toString(),
      userId: req.user._id.toString(),
    },
  });

  res.status(200).json({
    clientSecret: paymentIntent.client_secret,
  });
});

router.post("/create-payment-intent", protect, createPaymentIntent);

export default router;
