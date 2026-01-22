import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../components/LanguageProvider";
import { buildWhatsAppLink, buildWhatsAppMessage } from "../utils/whatsapp";
import { getCart, removeFromCart, updateQuantity } from "../utils/cart";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212600000000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const CartPage = () => {
  const { locale, t } = useLanguage();
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    platform: "",
    cart_link: ""
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const message = buildWhatsAppMessage({ items: cart, locale, customer });
  const waLink = buildWhatsAppLink(WHATSAPP_NUMBER, message);

  const handleSend = async () => {
    if (cart.length === 0) return;
    setSending(true);
    setError("");
    if (!WHATSAPP_NUMBER || WHATSAPP_NUMBER === "212600000000") {
      setSending(false);
      setError("Numéro WhatsApp manquant. Ajoute NEXT_PUBLIC_WHATSAPP_NUMBER.");
      return;
    }
    try {
      window.open(waLink, "_blank", "noopener,noreferrer");
      await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price_mad: item.price
          })),
          total_mad: total
        })
      });
    } catch (err) {
      setError("Impossible d'enregistrer la commande.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-800">{t("cart.title")}</h1>
      {cart.length === 0 ? (
        <p className="mt-4 text-gray-600">{t("cart.empty")}</p>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.slug} className="rounded-lg border bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.price} DH</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCart(removeFromCart(item.slug))}
                    className="text-xs text-red-500"
                  >
                    {t("cart.remove")}
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCart(updateQuantity(item.slug, Math.max(1, item.quantity - 1)))
                    }
                    className="h-8 w-8 rounded-full border text-sm"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setCart(updateQuantity(item.slug, item.quantity + 1))}
                    className="h-8 w-8 rounded-full border text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="rounded-lg border bg-white p-4 font-semibold">
              {t("cart.total")}: {total} DH
            </div>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <div className="space-y-3">
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder={t("cart.name")}
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder={t("cart.city")}
                value={customer.city}
                onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
              />
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder={t("cart.address")}
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
              />
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="WhatsApp"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              />
              <input
                className="w-full rounded-lg border px-3 py-2"
                value="DXN"
                readOnly
              />
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Lien du panier"
                value={customer.cart_link}
                onChange={(e) => setCustomer({ ...customer, cart_link: e.target.value })}
              />
            </div>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            <button
              type="button"
              onClick={handleSend}
              className="mt-5 inline-flex w-full justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white"
            >
              {sending ? "..." : t("cart.send")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
