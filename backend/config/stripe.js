import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(
  "sk_test_51QTys5P0HIIDl81RkCwWynnm9MgjE3pv5OKgZcKPQ4pCRI1kvQDDbmYr3sEAU6ofpBZ8AdTj2JS0OgIGGs75Jqj9009UiIywLl"
);

export default stripe;
