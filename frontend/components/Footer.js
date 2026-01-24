import { useLanguage } from "./LanguageProvider";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative overflow-hidden border-t bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white">
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
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 text-sm text-slate-200">
        <div className="footer-float flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p>DXN Morocco © 2026</p>
            <p className="mt-1 text-slate-300">{t("contact.subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/212624559497"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-white/20"
            >
              WhatsApp: +212624559497
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-white/20"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-white/20"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="footer-float rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase text-slate-400">DXN Produits</p>
            <div className="mt-3 space-y-2 text-sm">
              <a href="/categories" className="block text-slate-200 hover:text-emerald-300">Cafe DXN</a>
              <a href="/categories" className="block text-slate-200 hover:text-emerald-300">Spiruline & Ganoderma</a>
              <a href="/categories" className="block text-slate-200 hover:text-emerald-300">Complements alimentaires</a>
              <a href="/categories" className="block text-slate-200 hover:text-emerald-300">Produits bien-etre</a>
              <a href="/categories" className="block text-slate-200 hover:text-emerald-300">Cosmetiques naturels</a>
              <a href="/categories" className="block text-slate-200 hover:text-emerald-300">Nouveautes DXN</a>
            </div>
          </div>

          <div className="footer-float rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase text-slate-400">A propos de DXN</p>
            <div className="mt-3 space-y-2 text-sm">
              <a href="/a-propos" className="block text-slate-200 hover:text-emerald-300">Notre mission</a>
              <a href="/a-propos" className="block text-slate-200 hover:text-emerald-300">Pourquoi DXN</a>
              <a href="/a-propos" className="block text-slate-200 hover:text-emerald-300">Qualite & certifications</a>
              <a href="/a-propos" className="block text-slate-200 hover:text-emerald-300">Nos partenaires</a>
              <a href="/temoignages" className="block text-slate-200 hover:text-emerald-300">Avis clients</a>
              <a href="/volunteer" className="block text-slate-200 hover:text-emerald-300">Nous rejoindre</a>
            </div>
          </div>

          <div className="footer-float rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase text-slate-400">Aide</p>
            <div className="mt-3 space-y-2 text-sm">
              <a href="/contact" className="block text-slate-200 hover:text-emerald-300">Nous contacter</a>
              <a href="/panier" className="block text-slate-200 hover:text-emerald-300">Suivi de commande</a>
              <a href="/contact" className="block text-slate-200 hover:text-emerald-300">Livraison & retours</a>
              <a href="/contact" className="block text-slate-200 hover:text-emerald-300">Questions frequentes</a>
              <a href="/categories" className="block text-slate-200 hover:text-emerald-300">Blog & conseils</a>
              <a href="/volunteer" className="block text-slate-200 hover:text-emerald-300">Devenir distributeur</a>
            </div>
          </div>

          <div className="footer-float rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase text-slate-400">Liens rapides</p>
            <div className="mt-3 space-y-2 text-sm">
              <a href="/categories" className="block text-emerald-300">Catalogue DXN</a>
              <a href="/a-propos" className="block text-slate-200 hover:text-emerald-300">A propos</a>
              <a href="/contact" className="block text-slate-200 hover:text-emerald-300">Contact</a>
              <a href="/temoignages" className="block text-slate-200 hover:text-emerald-300">Avis clients</a>
              <a href="/volunteer" className="block text-slate-200 hover:text-emerald-300">Devenir un membre</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
