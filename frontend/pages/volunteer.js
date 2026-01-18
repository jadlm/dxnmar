import { useState } from "react";
import { useLanguage } from "../components/LanguageProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const VolunteerPage = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    city: "",
    phone: "",
    motivation: "",
    availability: ""
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    if (!form.name || !form.city || !form.phone) {
      setStatus("Veuillez remplir les champs obligatoires.");
      return;
    }
    setSending(true);
    setStatus("Envoi en cours...");
    try {
      const res = await fetch(`${API_URL}/api/volunteers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("volunteer");
      setStatus("Demande envoyée avec succès.");
      setForm({ name: "", city: "", phone: "", motivation: "" });
    } catch (err) {
      setStatus("Impossible d'envoyer la demande.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-800">{t("volunteer.pageTitle")}</h1>
      <p className="mt-3 text-gray-600">{t("volunteer.pageIntro")}</p>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder={t("volunteer.form.name")}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder={t("volunteer.form.city")}
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder={t("volunteer.form.phone")}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Disponibilité"
          value={form.availability}
          onChange={(e) => setForm({ ...form, availability: e.target.value })}
        />
        <textarea
          rows="4"
          className="w-full rounded-lg border px-3 py-2"
          placeholder={t("volunteer.form.motivation")}
          value={form.motivation}
          onChange={(e) => setForm({ ...form, motivation: e.target.value })}
        />
        {status && (
          <div className="rounded-lg border bg-white px-3 py-2 text-sm text-gray-700">
            {status}
          </div>
        )}
        <button
          type="submit"
          disabled={sending}
          className="w-full text-center rounded-full bg-dxnGreen px-6 py-3 text-sm font-semibold text-white disabled:opacity-70"
        >
          {sending ? "..." : t("volunteer.form.submit")}
        </button>
      </form>
    </div>
  );
};

export default VolunteerPage;
