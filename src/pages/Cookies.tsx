import { LegalPage } from "@/components/site/LegalPage";

const Cookies = () => (
  <LegalPage
    title="Cookie Policy"
    description="This Cookie Policy explains how BizHive uses cookies, local storage, and similar technologies to keep sessions stable, remember product preferences, and improve the reliability of the user experience."
    sections={[
      {
        title: "Operational cookies and local storage",
        body: "BizHive uses essential storage mechanisms to keep users signed in, preserve selected language and theme preferences, maintain consent status, remember temporary interface state, and support session continuity across page loads. Disabling or clearing such storage may reduce functionality, log users out, or reset important workflow state.",
      },
      {
        title: "Preference and product continuity",
        body: "Certain cookies or local storage keys may be used to remember workspace settings, onboarding progress, temporary admin-access state, and other interface decisions that improve continuity between visits. These mechanisms are used to make the product feel consistent instead of forcing repeated setup actions on every session.",
      },
      {
        title: "Analytics and product improvement",
        body: "BizHive may use analytics or measurement technologies to understand product traffic, identify broken flows, diagnose layout and usability friction, and improve the effectiveness of learning, document, and workspace surfaces. Such analytics are used for service improvement, performance understanding, and operational planning.",
      },
      {
        title: "Managing cookies",
        body: "Users can generally manage cookies through browser controls or device settings. However, blocking essential storage may impair login, preference retention, saved-state continuity, and other core platform functions. BizHive may continue using strictly necessary mechanisms where required to provide a requested service or maintain platform integrity.",
      },
    ]}
  />
);

export default Cookies;
