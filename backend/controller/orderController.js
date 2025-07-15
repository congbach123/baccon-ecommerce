import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

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
      // orderItems,
      orderItems: orderItems.map((item) => ({
        // name: item.product.name,
        // qty: item.quantity,
        // image: item.product.image,
        // price: item.product.price,
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
// @route   POST /api/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});
// i will give you my orderDetail and orderController and the Order page and orderController of my friend, my friend integrate stripe by leading to their site session to pay, i want you to do the same for mine, also, ignore the StripePayment element and related, i want it to deleted, it was scrapped
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

// // @desc    Update order to paid
// // @route   PUT /api/orders/:id/pay
// // @access  Private
// const updateOrderToPaid = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);
//   if (order) {
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.paymentResult = {
//       id: req.body.id,
//       status: req.body.status,
//       update_time: req.body.update_time,
//       email_address: req.body.email_address,
//     };

//     const updatedOrder = await order.save();
//     res.status(200).json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });

// @desc    Update order to paid
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

export const paymentWithStripe = async (req, res, next) => {
  if (!req.user.id) {
    return res.status(401).json({ message: "You are not logged in" });
  }

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (paymentMethod === "COD") {
    return res
      .status(404)
      .json({ message: "This method does not need to pay by Stripe" });
  }

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: `${product.name}`,
        images: [product.image],
        // metadata: {
        //   color: product.color,
        //   size: product.size,
        // },
      },
      unit_amount: product.price,
    },
    quantity: product.quantity,
  }));
  try {
    // tuong tu nhu new Order({}) + await newOrder.save()
    const newOrder = await Order.create({
      userId,
      receiverName,
      receiverPhone,
      receiverNote,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentCheck: false,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["VN"],
      },
      shipping_options: [
        {
          shipping_rate: "shr_1RkyQLP0HIIDl81RUHnuJwwD",
          ship,
          // shipping_rate: "shr_1PnhI3ELWvlzH2IqQxOkTi8p", //ship
        },
      ],
      line_items: lineItems,
      client_reference_id: userId,
      success_url: `${process.env.ECOMMERCE_STORE_URL}/paymentSuccess/${newOrder._id}`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
      metadata: {
        receiverName,
        receiverPhone,
        receiverNote,
        shippingAddress,
        totalAmount,
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    next(error);
  }
};

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
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
};
