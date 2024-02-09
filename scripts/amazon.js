import { products } from "../data/products.js";
import { cart, addedToCart } from "../data/cart.js";

let productHtml = "";

products.forEach((product) => {
  productHtml += `        <div class="product-container">
  <div class="product-image-container">
    <img src="${product.image}" class="product-image" />
  </div>

  <div class="product-name limit-text-to-2-lines">
    ${product.name}
  </div>

  <div class="product-rating-container">
    <img
      src="images/ratings/rating-${product.rating.stars * 10}.png"
      class="product-rating-star"
    />
    <div class="product-rating-count link-primary">${product.rating.count}</div>
  </div>
  <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>

  <div class="product-quantity-container">
    <select>
      <option selected value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
  </div>

  <div class="product-spacer"></div>

  <div class="added-to-cart">
    <img src="images/icons/checkmark.png" />
    Added
  </div>

  <button class="added-to-cart-button button-primary" data-product-id="${
    product.id
  }">
    Add to Cart
  </button>
</div>`;
});

document.querySelector(".product-grid").innerHTML = productHtml;
document.querySelector(".cart-quantity").innerHTML =
  localStorage.getItem("cartQuantity");

function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector(".cart-quantity").innerHTML = cartQuantity;

  localStorage.setItem("cartQuantity", cartQuantity);
}

document.querySelectorAll(".added-to-cart-button").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;
    addedToCart(productId);
    updateCartQuantity();
  });
});
