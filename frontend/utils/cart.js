const CART_KEY = "dxn_cart";

export const getCart = () => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveCart = (items) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const addToCart = (item) => {
  const cart = getCart();
  const existing = cart.find((c) => c.slug === item.slug);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
  return cart;
};

export const removeFromCart = (slug) => {
  const cart = getCart().filter((c) => c.slug !== slug);
  saveCart(cart);
  return cart;
};

export const updateQuantity = (slug, quantity) => {
  const cart = getCart().map((c) =>
    c.slug === slug ? { ...c, quantity } : c
  );
  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  saveCart([]);
};
