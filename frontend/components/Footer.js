import { useLanguage } from "./LanguageProvider";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative overflow-hidden bg-white border-t">
      <div className="pointer-events-none absolute inset-0">
        <span className="pill pill-1" />
        <span className="pill pill-2" />
        <span className="pill pill-3" />
        <span className="pill pill-4" />
        <span className="pill pill-5" />
        <span className="pill pill-6" />
        <span className="pill pill-7" />
        <span className="pill pill-8" />
        <span className="pill pill-9" />
        <span className="pill pill-10" />
        <span className="pill pill-11" />
        <span className="pill pill-12" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 text-sm text-gray-600">
        <div className="footer-float flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p>DXN Morocco © 2026</p>
            <p className="mt-1">{t("contact.subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/212624559497"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border px-4 py-2 text-xs font-semibold text-dxnGreen"
            >
              WhatsApp: +212624559497
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border px-4 py-2 text-xs font-semibold text-gray-700"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border px-4 py-2 text-xs font-semibold text-gray-700"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="footer-float rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase text-gray-400">DXN Produits</p>
            <div className="mt-3 space-y-2 text-sm">
              <a href="/categories" className="block text-gray-600 hover:text-dxnGreen">Cafe DXN</a>
              <a href="/categories" className="block text-gray-600 hover:text-dxnGreen">Spiruline & Ganoderma</a>
              <a href="/categories" className="block text-gray-600 hover:text-dxnGreen">Complements alimentaires</a>
              <a href="/categories" className="block text-gray-600 hover:text-dxnGreen">Produits bien-etre</a>
              <a href="/categories" className="block text-gray-600 hover:text-dxnGreen">Cosmetiques naturels</a>
              <a href="/categories" className="block text-gray-600 hover:text-dxnGreen">Nouveautes DXN</a>
            </div>
          </div>

          <div className="footer-float rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase text-gray-400">A propos de DXN</p>
            <div className="mt-3 space-y-2 text-sm">
              <a href="/a-propos" className="block text-gray-600 hover:text-dxnGreen">Notre mission</a>
              <a href="/a-propos" className="block text-gray-600 hover:text-dxnGreen">Pourquoi DXN</a>
              <a href="/a-propos" className="block text-gray-600 hover:text-dxnGreen">Qualite & certifications</a>
              <a href="/a-propos" className="block text-gray-600 hover:text-dxnGreen">Nos partenaires</a>
              <a href="/temoignages" className="block text-gray-600 hover:text-dxnGreen">Avis clients</a>
              <a href="/volunteer" className="block text-gray-600 hover:text-dxnGreen">Nous rejoindre</a>
            </div>
          </div>

          <div className="footer-float rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase text-gray-400">Aide</p>
            <div className="mt-3 space-y-2 text-sm">
              <a href="/contact" className="block text-gray-600 hover:text-dxnGreen">Nous contacter</a>
              <a href="/panier" className="block text-gray-600 hover:text-dxnGreen">Suivi de commande</a>
              <a href="/contact" className="block text-gray-600 hover:text-dxnGreen">Livraison & retours</a>
              <a href="/contact" className="block text-gray-600 hover:text-dxnGreen">Questions frequentes</a>
              <a href="/categories" className="block text-gray-600 hover:text-dxnGreen">Blog & conseils</a>
              <a href="/volunteer" className="block text-gray-600 hover:text-dxnGreen">Devenir distributeur</a>
            </div>
          </div>

          <div className="footer-float rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase text-gray-400">Liens rapides</p>
            <div className="mt-3 space-y-2 text-sm">
              <a href="/categories" className="block text-dxnGreen">Catalogue DXN</a>
              <a href="/a-propos" className="block text-gray-600">A propos</a>
              <a href="/contact" className="block text-gray-600">Contact</a>
              <a href="/temoignages" className="block text-gray-600">Avis clients</a>
              <a href="/volunteer" className="block text-gray-600">Devenir un membre</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
