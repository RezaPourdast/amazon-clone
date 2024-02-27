export let cart = JSON.parse(localStorage.getItem("cart"));
const cartQuantity = localStorage.getItem("cartQuantity");

if (!cart) {
  cart = [
    {
      productId: "m1n2o3p4-q5r6-s7t8-u9v1-w2x3y4z5a6b",
      quantity: 2,
      deliveryOptionId: "1",
    },
    {
      productId: "2f8d9e7c-1b3a-4c6d-9e2f-8a7b6c5d4e3f",
      quantity: 1,
      deliveryOptionId: "3",
    },
  ];
}

if (!cartQuantity) {
  localStorage.setItem("cartQuantity", 0);
}

export function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addedToCart(productId, selectedQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += selectedQuantity;
  } else {
    cart.push({
      productId: productId,
      quantity: selectedQuantity,
      deliveryOptionId: "1",
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

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}

export function addedMessage(productId, addedMessageTimeouts) {
  const addedMessage = document.querySelector(`.js-added-to-cart${productId}`);

  addedMessage.classList.add("added-to-cart-visible");

  setTimeout(() => {
    const previousTimeoutId = addedMessageTimeouts[productId];
    if (previousTimeoutId) {
      clearTimeout(previousTimeoutId);
    }

    const timeoutId = setTimeout(() => {
      addedMessage.classList.remove("added-to-cart-visible");
    }, 2000);

    addedMessageTimeouts[productId] = timeoutId;
  });
}
