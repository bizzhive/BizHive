import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// In a production app, these should be loaded from public/locales/{lng}/translation.json using i18next-http-backend.
// We include some inline translations here for demonstration purposes.
const resources = {
  en: {
    translation: {
      "India's Business Growth Platform": "India's Business Growth Platform",
      "Start Planning Free": "Start Planning Free",
      "Explore Tools": "Explore Tools",
      "Login": "Login",
      "Get Started Free": "Get Started Free",
      "Welcome to BizHive": "Welcome to BizHive",
    },
  },
  hi: {
    translation: {
      "India's Business Growth Platform": "भारत का व्यापार विकास मंच",
      "Build Your": "अपना निर्माण करें",
      "Business Empire": "व्यापार साम्राज्य",
      "Start Planning Free": "मुफ्त योजना शुरू करें",
      "Explore Tools": "उपकरण देखें",
      "Get Started Free": "मुफ्त में शुरू करें",
      "Login": "लॉग इन करें",
      "Welcome to BizHive": "बिज़हाइव में आपका स्वागत है",
      "Join thousands of entrepreneurs building successful businesses": "सफल व्यवसाय बनाने वाले हजारों उद्यमियों से जुड़ें",
      "Sign In": "साइन इन करें",
      "Sign Up": "साइन अप करें",
      "Email": "ईमेल",
      "Password": "पासवर्ड",
      "Continue with Google": "गूगल के साथ जारी रखें",
      "Don't have an account?": "खाता नहीं है?",
      "Already have an account?": "पहले से खाता है?",
      "Create an Account": "खाता बनाएं",
      "Welcome Back": "वापसी पर स्वागत है",
      "Enter your details to get started": "शुरू करने के लिए अपना विवरण दर्ज करें",
      "Enter your credentials to access your account": "अपने खाते तक पहुंचने के लिए क्रेडेंशियल दर्ज करें",
      "Or continue with": "या इसके साथ जारी रखें",
      "Why Join BizHive?": "बिज़हाइव क्यों शामिल हों?",
      "Premium Document Access": "प्रीमियम दस्तावेज़ एक्सेस",
      "Expert Community": "विशेषज्ञ समुदाय",
      "AI Business Advisor": "एआई बिजनेस एडवाइजर",
      "Access 500+ legal templates and business documents": "500+ कानूनी टेम्प्लेट और व्यावसायिक दस्तावेज़ों तक पहुँचें",
      "Connect with mentors and fellow entrepreneurs": "मेंटर्स और साथी उद्यमियों के साथ जुड़ें",
      "Get personalized guidance from Bee AI": "Bee AI से व्यक्तिगत मार्गदर्शन प्राप्त करें",
    },
  },
  es: {
    translation: {
      "India's Business Growth Platform": "Plataforma de Crecimiento Empresarial de India",
      "Build Your": "Construye Tu",
      "Business Empire": "Imperio Comercial",
      "Start Planning Free": "Empieza a Planificar Gratis",
      "Explore Tools": "Explorar Herramientas",
      "Get Started Free": "Empieza Gratis",
      "Login": "Acceso",
      "Welcome to BizHive": "Bienvenido a BizHive",
      "Sign In": "Iniciar Sesión",
      "Sign Up": "Registrarse",
      "Email": "Correo electrónico",
      "Password": "Contraseña",
    },
  },
  fr: {
    translation: {
      "Start Planning Free": "Commencez à planifier gratuitement",
      "Explore Tools": "Explorer les outils",
      "Login": "Connexion",
      "Welcome to BizHive": "Bienvenue sur BizHive",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    // This allows you to use the English phrase as the key
    // If translation is missing, it shows the key (English text)
    keySeparator: false,
    nsSeparator: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;