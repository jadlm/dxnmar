import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LanguageProvider, useLanguage } from "../components/LanguageProvider";

const Layout = ({ Component, pageProps }) => {
  const { dir } = useLanguage();

  return (
    <div className={dir === "rtl" ? "rtl" : ""}>
      <Navbar />
      <main className="min-h-screen">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
};

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Layout Component={Component} pageProps={pageProps} />
    </LanguageProvider>
  );
}
