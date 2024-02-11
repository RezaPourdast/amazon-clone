export let cart = JSON.parse(localStorage.getItem("cart"));
const cartQuantity = localStorage.getItem("cartQuantity");

if (!cart) {
  cart = [
    {
      productId: "m1n2o3p4-q5r6-s7t8-u9v1-w2x3y4z5a6b",
      quantity: 2,
      deliveryOptionId: 1,
    },
    {
      productId: "2f8d9e7c-1b3a-4c6d-9e2f-8a7b6c5d4e3f",
      quantity: 1,
      deliveryOptionId: 3,
    },
  ];
}

if (!cartQuantity) {
  localStorage.setItem("cartQuantity", 0);
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addedToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryOptionsId: 1,
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}

export function updateCartQuantity(itemQuantity) {
  const oldLocal = localStorage.getItem("cartQuantity");
  const newLocal = oldLocal - itemQuantity;
  localStorage.setItem("cartQuantity", newLocal);
}
