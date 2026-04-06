import { LegalPage } from "@/components/site/LegalPage";

const Cookies = () => (
  <LegalPage
    title="Cookie Policy"
    description="This page explains how BizHive uses cookies and local storage to keep the product usable and consistent."
    sections={[
      {
        title: "Why we use cookies",
        body: "BizHive uses cookies and similar storage mechanisms to keep users signed in, remember UI preferences such as language and theme, preserve consent choices, and maintain basic product continuity across sessions.",
      },
      {
        title: "Operational storage",
        body: "Some local storage is used for temporary product state, such as short-term admin unlock state, pending verification information, and UI preferences. Removing this storage may reset parts of the interface or sign you out.",
      },
      {
        title: "Analytics and improvement",
        body: "We may use analytics tools to understand how pages are used, which flows break, and where layout problems create friction. This helps improve navigation, accessibility, and product reliability.",
      },
    ]}
  />
);

export default Cookies;
