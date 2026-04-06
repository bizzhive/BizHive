import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      setShow(true);
    }
  }, []);

  const handleConsent = (value: "accepted" | "declined") => {
    localStorage.setItem("cookie-consent", value);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed inset-x-0 bottom-4 z-50 px-4"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-[24px] border border-border/80 bg-card p-4 shadow-[0_18px_60px_rgba(15,23,42,0.16)] sm:flex-row sm:items-center">
            <p className="flex-1 text-sm leading-6 text-muted-foreground">
              {t("cookie.body")}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" className="rounded-2xl border border-border/80" onClick={() => handleConsent("declined")}>
                {t("cookie.decline")}
              </Button>
              <Button className="rounded-2xl" onClick={() => handleConsent("accepted")}>
                {t("cookie.accept")}
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default CookieConsent;
