export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  state.itemsPrice = addDecimals(
    state.cartItems.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    )
  );

  state.shippingPrice = addDecimals(
    parseFloat(state.itemsPrice) > 100 ? 0 : 10
  );

  state.taxPrice = addDecimals(parseFloat(state.itemsPrice) * 0.08);

  state.totalPrice = addDecimals(
    parseFloat(state.itemsPrice) +
      parseFloat(state.shippingPrice) +
      parseFloat(state.taxPrice)
  );

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
