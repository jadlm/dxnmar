import { useState } from "react";
import { useLanguage } from "../components/LanguageProvider";
import TestimonialCard from "../components/TestimonialCard";
import { buildTestimonialMessage, buildWhatsAppLink } from "../utils/whatsapp";

const WHATSAPP_NUMBER = "212600000000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const TestimonialsPage = () => {
  const { t, locale } = useLanguage();
  const [form, setForm] = useState({ name: "", city: "", message: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const testimonials = t("testimonials.items");
  const waMessage = buildTestimonialMessage({ locale, ...form });
  const waLink = buildWhatsAppLink(WHATSAPP_NUMBER, waMessage);

  const handleSend = async () => {
    if (!form.name || !form.message) {
      setError("Veuillez remplir le nom et le témoignage.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await fetch(`${API_URL}/api/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          message_fr: locale === "fr" ? form.message : form.message,
          message_ar: locale === "ar" ? form.message : form.message,
          rating: 5
        })
      });
    } catch (err) {
      setError("Impossible d'enregistrer le témoignage.");
    } finally {
      setSending(false);
      window.open(waLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-800">{t("testimonials.title")}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {Array.isArray(testimonials) &&
          testimonials.map((item, index) => (
            <TestimonialCard key={index} text={item} />
          ))}
      </div>
      <div className="mt-10 rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">{t("testimonials.formTitle")}</h2>
        <div className="mt-4 grid gap-3">
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder={t("testimonials.name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full rounded-lg border px-3 py-2"
            placeholder={t("testimonials.city")}
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <textarea
            rows="4"
            className="w-full rounded-lg border px-3 py-2"
            placeholder={t("testimonials.message")}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="button"
            onClick={handleSend}
            className="mt-2 inline-flex w-full justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white"
          >
            {sending ? "..." : t("testimonials.send")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
