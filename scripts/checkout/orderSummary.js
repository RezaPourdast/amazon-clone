import {
  cart,
  removeFromCart,
  saveToStorage,
  updateCartQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import deliveryOptions from "../../data/deliveryOptions.js";
import { products } from "../../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { renderPaymentSummary } from "./paymentsummary.js";

export function renderCheckoutPage() {
  let productSummaryHtml = "";

  function updateHeaderLink() {
    document.querySelector(
      ".js-header-quantity-link"
    ).innerHTML = `${localStorage.getItem("cartQuantity")} items`;
  }

  updateHeaderLink();

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    productSummaryHtml += `<div class="cart-item-container js-container-id-${
      matchingProduct.id
    }">
              <div class="delivery-date">Delivery date: ${dateString}</div>
  
              <div class="cart-item-details-grid">
                <img class="product-image" src="${matchingProduct.image}" />
  
                <div class="cart-item-details">
                  <div class="product-name">${matchingProduct.name}</div>
                  <div class="product-price">$${(
                    matchingProduct.priceCents / 100
                  ).toFixed(2)}</div>
                  <div class="product-quantity">
                    <span> Quantity: <span class="quantity-label js-quantity-${
                      matchingProduct.id
                    }">${cartItem.quantity}</span> </span>
                    <input class="js-new-quantity-input-${
                      matchingProduct.id
                    } new-quantity-input" type="number" value="${
      cartItem.quantity
    }">
                    <span class="update-quantity-link js-update-quantity-link-${
                      matchingProduct.id
                    } link-primary">
                      Update
                    </span>
                    <span class="js-save-quantity-link-${
                      matchingProduct.id
                    } save-quantity-link link-primary">
                      Save
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-btn" data-product-id="${
                      matchingProduct.id
                    }">
                      Delete
                    </span>
                  </div>
                </div>
  
                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${deliveryOptionsHtml(matchingProduct, cartItem)}
                </div>
              </div>
            </div>`;
  });

  function deliveryOptionsHtml(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");
      const priceString =
        deliveryOption.priceCents === 0
          ? "Free"
          : `$${(deliveryOption.priceCents / 100).toFixed(2)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `<div class="delivery-option js-deliveryOption"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
      <input
        type="radio"
        ${isChecked ? "checked" : ""}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}"
      />
      <div>
        <div class="delivery-option-date">${dateString}</div>
        <div class="delivery-option-price">${priceString} - Shipping</div>
      </div>
    </div>`;
    });
    return html;
  }

  document.querySelector(".order-summary").innerHTML = productSummaryHtml;

  document.querySelectorAll(".js-delete-btn").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      removeFromCart(productId);

      const itemQuantity = document.querySelector(
        `.js-quantity-${productId}`
      ).innerHTML;
      const container = document.querySelector(`.js-container-id-${productId}`);

      updateCartQuantity(itemQuantity);
      updateHeaderLink();
      renderPaymentSummary();
      container.remove();
    });
  });

  document.querySelectorAll(".js-deliveryOption").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderCheckoutPage();
      renderPaymentSummary();
    });
  });
  let selectedQuantity = 0;

  cart.forEach((cartItem) => {
    let matchingProduct;
    const productId = cartItem.productId;
    const updateBtn = document.querySelector(
      `.js-update-quantity-link-${productId}`
    );
    const saveBtn = document.querySelector(
      `.js-save-quantity-link-${productId}`
    );
    const quantitySelector = document.querySelector(
      `.js-new-quantity-input-${productId}`
    );

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });

    updateBtn.addEventListener("click", () => {
      updateBtn.setAttribute("style", "display: none;");
      quantitySelector.setAttribute("style", "display: inline;");
      saveBtn.setAttribute("style", "display: inline;");
    });

    quantitySelector.addEventListener("click", () => {
      const selObj = document.querySelector(
        `.js-new-quantity-input-${matchingProduct.id}`
      );
      const selValue = selObj.value;
      if (selValue > 0) {
        selectedQuantity = Number(selValue);
      }
    });

    saveBtn.addEventListener("click", () => {
      if (
        document.querySelector(`.js-new-quantity-input-${matchingProduct.id}`)
          .value < 1
      ) {
        alert("please take more then 1");
      } else if (selectedQuantity === 0) {
        return;
      } else {
        const itemQuantity = String(selectedQuantity) - cartItem.quantity;
        const oldLocal = localStorage.getItem("cartQuantity");
        const newLocal = Number(oldLocal) + itemQuantity;
        localStorage.setItem("cartQuantity", newLocal);
        cartItem.quantity = selectedQuantity;

        saveToStorage();
        renderCheckoutPage();
        renderPaymentSummary();
        updateBtn.setAttribute("style", "display: inline;");
        quantitySelector.setAttribute("style", "display: none;");
        saveBtn.setAttribute("style", "display: none;");
      }
    });
  });
}

renderCheckoutPage();
