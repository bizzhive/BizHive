import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShow(true);
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem("cookie-consent", accepted ? "accepted" : "declined");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="mx-auto max-w-4xl rounded-xl border bg-background/95 backdrop-blur-sm p-4 shadow-lg flex flex-col sm:flex-row items-center gap-4">
            <p className="text-sm text-muted-foreground flex-1">{t("cookie.message")}</p>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => handleConsent(false)}>
                {t("cookie.decline")}
              </Button>
              <Button size="sm" onClick={() => handleConsent(true)}>
                {t("cookie.accept")}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
