import Link from "next/link";
import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";
import { getCart } from "../utils/cart";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  /* ============================= */
  /* UPDATE CART COUNT REALTIME */
  /* ============================= */
  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const total = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(total);
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () =>
      window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/images/logo_logo3.png"
            alt="DXN Logo"
            className="h-10 w-10 rounded-full object-contain"
          />
          <span className="text-xl font-semibold text-dxnGreen">
            DXN Morocco
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden gap-6 md:flex items-center">
          <Link href="/" className="text-sm text-gray-700 hover:text-dxnGreen">
            {t("nav.home")}
          </Link>

          <Link href="/categories" className="text-sm text-gray-700 hover:text-dxnGreen">
            {t("nav.categories")}
          </Link>

          {/* CART ICON */}
          <Link href="/panier" className="relative text-gray-700 hover:text-dxnGreen">
            <ShoppingCart size={24} />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </Link>

          <Link href="/volunteer" className="text-sm text-gray-700 hover:text-dxnGreen">
            {t("nav.volunteer")}
          </Link>

          <Link href="/temoignages" className="text-sm text-gray-700 hover:text-dxnGreen">
            {t("nav.testimonials")}
          </Link>

          <Link href="/a-propos" className="text-sm text-gray-700 hover:text-dxnGreen">
            {t("nav.about")}
          </Link>

          <Link href="/contact" className="text-sm text-gray-700 hover:text-dxnGreen">
            {t("nav.contact")}
          </Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <button
            type="button"
            className="md:hidden rounded-lg border px-3 py-2 text-sm"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 text-sm">

            <Link href="/" onClick={() => setOpen(false)}>
              {t("nav.home")}
            </Link>

            <Link href="/categories" onClick={() => setOpen(false)}>
              {t("nav.categories")}
            </Link>

            <Link href="/panier" onClick={() => setOpen(false)}>
              🛒 {t("nav.cart")} ({cartCount})
            </Link>

            <Link href="/volunteer" onClick={() => setOpen(false)}>
              {t("nav.volunteer")}
            </Link>

            <Link href="/temoignages" onClick={() => setOpen(false)}>
              {t("nav.testimonials")}
            </Link>

            <Link href="/a-propos" onClick={() => setOpen(false)}>
              {t("nav.about")}
            </Link>

            <Link href="/contact" onClick={() => setOpen(false)}>
              {t("nav.contact")}
            </Link>

          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
