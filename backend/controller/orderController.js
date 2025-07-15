import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import stripe from "../config/stripe.js"; // Your stripe config file

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else if (!shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error("Shipping address and payment method are required");
  } else {
    const order = new Order({
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Create Stripe checkout session for existing order
// @route   POST /api/orders/:id/create-checkout-session
// @access  Private
const createCheckoutSession = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check if user owns this order
  if (order.user._id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to pay for this order");
  }

  // Check if order is already paid
  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  // Only allow Stripe payments
  if (order.paymentMethod === "COD") {
    res.status(400);
    throw new Error("Cash on Delivery orders do not need Stripe payment");
  }

  try {
    // Create line items from order items
    const lineItems = order.orderItems.map((item) => {
      const productData = {
        name: item.name,
      };

      // Convert relative URLs to absolute URLs for Stripe
      if (item.image) {
        let imageUrl = item.image;

        // If it's a relative URL, convert to absolute
        if (imageUrl.startsWith("/")) {
          const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
          imageUrl = `${baseUrl}${imageUrl}`;
        }

        // Only add if it's now a valid URL
        try {
          new URL(imageUrl);
          productData.images = [imageUrl];
        } catch (error) {
          // Skip invalid images
          console.log(`Skipping invalid image URL: ${imageUrl}`);
        }
      }

      return {
        price_data: {
          currency: "usd",
          product_data: productData,
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.qty,
      };
    });

    // Add shipping as a line item if there's a shipping cost
    if (order.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(order.shippingPrice * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as a line item if there's tax
    if (order.taxPrice > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tax",
          },
          unit_amount: Math.round(order.taxPrice * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      client_reference_id: order._id.toString(),
      customer_email: order.user.email,
      success_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/payment-success/${order._id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/order/${order._id}`,
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    res.status(500);
    throw new Error("Failed to create payment session");
  }
});

// @desc    Confirm payment and update order
// @route   PUT /api/orders/:id/confirm-payment
// @access  Private
const confirmPayment = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  console.log("Confirm payment called for order:", req.params.id);
  console.log("Session ID:", sessionId);

  if (!sessionId) {
    res.status(400);
    throw new Error("Session ID is required");
  }

  try {
    // Retrieve the session from Stripe to confirm payment
    console.log("Retrieving session from Stripe...");
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Stripe session payment_status:", session.payment_status);

    if (session.payment_status !== "paid") {
      res.status(400);
      throw new Error("Payment not completed");
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    console.log("Order found. Current payment status:", order.isPaid);

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized");
    }

    // Update order payment status
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: session.payment_intent,
      status: session.payment_status,
      update_time: new Date().toISOString(),
      method: "stripe",
      email_address: session.customer_email,
    };

    const updatedOrder = await order.save();
    console.log(
      "Order updated successfully. New payment status:",
      updatedOrder.isPaid
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500);
    throw new Error("Failed to confirm payment");
  }
});

// @desc    Update order to paid (legacy function, updated for Stripe)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();

    // Handle both Stripe and legacy PayPal data
    if (req.body.paymentMethod === "stripe") {
      order.paymentResult = {
        id: req.body.paymentIntentId,
        status: req.body.status,
        update_time: new Date().toISOString(),
        method: "stripe",
        amount_paid: req.body.amount_paid,
      };
    } else {
      // Legacy PayPal format
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send("update order to delivered");
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  res.send("get all orders");
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  createCheckoutSession,
  confirmPayment,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
};
