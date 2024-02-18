import { cart } from "../../data/cart.js";
import deliveryOptions from "../../data/deliveryOptions.js";
import { products } from "../../data/products.js";

export function renderPaymentSummary() {
  const cartQuantity = localStorage.getItem("cartQuantity");
  let paymentSummaryHtml = "";

  let matchingProduct;
  let allItemsPrice = 0;

  let totalShipping = 0;

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;

        const eachItemPriceCents = matchingProduct.priceCents;
        const eachItemTimesQuantity = cartItem.quantity;
        const totalEachItemPriceCents =
          eachItemPriceCents * eachItemTimesQuantity;
        allItemsPrice += totalEachItemPriceCents;
      }
    });

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
        totalShipping += deliveryOptionId === 1 ? 0 : deliveryOption.priceCents;
      }
    });

    const totalBeforeTax = allItemsPrice + totalShipping;
    const estimatedTax = (totalBeforeTax * 10) / 100;
    const orderTotal = totalBeforeTax + estimatedTax;

    paymentSummaryHtml = `<div class="payment-summary-title">
    Order Summary
  </div>

  <div class="payment-summary-row">
    <div>Items (${cartQuantity}):</div>
    <div class="payment-summary-money">$${(allItemsPrice / 100).toFixed(
      2
    )} </div>
  </div>

  <div class="payment-summary-row">
    <div>Shipping &amp; handling:</div>
    <div class="payment-summary-money">$${(totalShipping / 100).toFixed(
      2
    )}</div>
  </div>

  <div class="payment-summary-row subtotal-row">
    <div>Total before tax:</div>
    <div class="payment-summary-money">$${(totalBeforeTax / 100).toFixed(
      2
    )}</div>
  </div>

  <div class="payment-summary-row">
    <div>Estimated tax (10%):</div>
    <div class="payment-summary-money">$${(estimatedTax / 100).toFixed(2)}</div>
  </div>

  <div class="payment-summary-row total-row">
    <div>Order total:</div>
    <div class="payment-summary-money">$${(orderTotal / 100).toFixed(2)}</div>
  </div>

  <button class="place-order-button button-primary">
    Place your order
  </button>`;
  });
  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHtml;
}
