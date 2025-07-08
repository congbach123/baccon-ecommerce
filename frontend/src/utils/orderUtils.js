// utils/orderUtils.js
export const transformCartItemsToOrderItems = (cartItems) => {
  return cartItems.map((item) => ({
    name: item.product.name,
    qty: item.quantity,
    image: item.product.image,
    price: item.product.price,
    product: item.product._id,
  }));
};
