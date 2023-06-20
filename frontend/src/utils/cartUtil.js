export const addDecimal = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //Calculate Items Price
  state.itemsPrice = addDecimal(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  //Calculate Shipping Price
  state.shippingPrice = addDecimal(state.itemsPrice > 100 ? 0 : 5);

  //Calculate Tax Price
  state.taxPrice = addDecimal(Number((0.15 * state.itemsPrice).toFixed(2)));

  //Calculate Total Price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));
};
