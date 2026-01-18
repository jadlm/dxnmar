export const buildWhatsAppMessage = ({ items, locale, customer }) => {
  const isAr = locale === "ar";
  const intro = isAr
    ? "السلام عليكم، أرغب في طلب:"
    : "Bonjour, je souhaite commander :";
  const totalLabel = isAr ? "المجموع" : "Total";
  const nameLabel = isAr ? "الاسم" : "Nom";
  const cityLabel = isAr ? "المدينة" : "Ville";
  const addressLabel = isAr ? "العنوان" : "Adresse";
  const phoneLabel = isAr ? "الهاتف" : "Téléphone";
  const platformLabel = isAr ? "المنصة" : "Plateforme";
  const cartLabel = isAr ? "رابط السلة" : "Lien panier";

  const lines = [
    intro,
    ...items.map(
      (item) => `- ${item.name} x${item.quantity}`
    ),
    `${totalLabel} : ${items.reduce((sum, item) => sum + item.price * item.quantity, 0)} DH`,
    `${nameLabel} : ${customer?.name || ""}`,
    `${cityLabel} : ${customer?.city || ""}`,
    `${addressLabel} : ${customer?.address || ""}`,
    `${phoneLabel} : ${customer?.phone || ""}`,
    `${platformLabel} : ${customer?.platform || ""}`,
    `${cartLabel} : ${customer?.cart_link || ""}`
  ];

  return lines.join("\n");
};

export const buildWhatsAppLink = (phone, message) => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
};

export const buildTestimonialMessage = ({ locale, name, city, message }) => {
  const isAr = locale === "ar";
  const intro = isAr ? "السلام عليكم، أود مشاركة شهادتي:" : "Bonjour, je souhaite partager mon témoignage :";
  const nameLabel = isAr ? "الاسم" : "Nom";
  const cityLabel = isAr ? "المدينة" : "Ville";
  const messageLabel = isAr ? "التجربة" : "Témoignage";

  return [
    intro,
    `${nameLabel} : ${name || ""}`,
    `${cityLabel} : ${city || ""}`,
    `${messageLabel} : ${message || ""}`
  ].join("\n");
};

export const buildVolunteerMessage = ({ locale, name, city, phone, motivation }) => {
  const isAr = locale === "ar";
  const intro = isAr ? "السلام عليكم، أود الانضمام كمتطوع:" : "Bonjour, je souhaite devenir volontaire :";
  const nameLabel = isAr ? "الاسم" : "Nom";
  const cityLabel = isAr ? "المدينة" : "Ville";
  const phoneLabel = isAr ? "الهاتف" : "Téléphone";
  const motivationLabel = isAr ? "سبب الانضمام" : "Motivation";

  return [
    intro,
    `${nameLabel} : ${name || ""}`,
    `${cityLabel} : ${city || ""}`,
    `${phoneLabel} : ${phone || ""}`,
    `${motivationLabel} : ${motivation || ""}`
  ].join("\n");
};
