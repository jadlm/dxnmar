import { buildWhatsAppLink } from "../utils/whatsapp";

const WhatsAppButton = ({ phone, message, children }) => {
  const link = buildWhatsAppLink(phone, message);

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white"
    >
      {children}
    </a>
  );
};

export default WhatsAppButton;
