import Link from "next/link";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";
import { getCartCount } from "../utils/cart";

const Navbar = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartCount());
    };

    updateCartCount();
    window.addEventListener("dxn-cart-updated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("dxn-cart-updated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/images/logo_logo3.png"
            alt="DXN Logo"
            className="h-10 w-10 rounded-full object-contain"
          />
          <span className="text-xl font-semibold text-dxnGreen">DXN Morocco</span>
        </Link>

        <nav className="hidden gap-4 md:flex">
          <Link href="/" className="text-sm text-gray-700 hover:text-dxnGreen">
            {t("nav.home")}
          </Link>
          <Link href="/categories" className="text-sm text-gray-700 hover:text-dxnGreen">
            {t("nav.categories")}
          </Link>
          <Link href="/panier" className="text-sm text-gray-700 hover:text-dxnGreen">
            {t("nav.cart")}
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

        <div className="flex items-center gap-3">
          <Link
            href="/panier"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border text-gray-700 hover:border-dxnGreen hover:text-dxnGreen"
            aria-label={t("nav.cart")}
          >
            <span className="text-lg">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-dxnGreen px-1 text-center text-xs font-semibold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <LanguageSwitcher />
          <button
            type="button"
            className="md:hidden rounded-lg border px-3 py-2 text-sm"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-sm">
            <Link href="/" className="text-gray-700" onClick={() => setOpen(false)}>
              {t("nav.home")}
            </Link>
            <Link href="/categories" className="text-gray-700" onClick={() => setOpen(false)}>
              {t("nav.categories")}
            </Link>
            <Link href="/panier" className="text-gray-700" onClick={() => setOpen(false)}>
              {t("nav.cart")} {cartCount > 0 ? `(${cartCount})` : ""}
            </Link>
            <Link href="/volunteer" className="text-gray-700" onClick={() => setOpen(false)}>
              {t("nav.volunteer")}
            </Link>
            <Link href="/temoignages" className="text-gray-700" onClick={() => setOpen(false)}>
              {t("nav.testimonials")}
            </Link>
            <Link href="/a-propos" className="text-gray-700" onClick={() => setOpen(false)}>
              {t("nav.about")}
            </Link>
            <Link href="/contact" className="text-gray-700" onClick={() => setOpen(false)}>
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
