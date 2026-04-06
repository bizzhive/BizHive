import { LayoutTemplate, StickyNote } from "lucide-react";
import { StructuredToolWorkbench } from "@/components/tool/StructuredToolWorkbench";
import { Surface } from "@/components/site/SitePrimitives";

const BusinessCanvas = () => (
  <StructuredToolWorkbench
    eyebrow="Strategy tool"
    title="Business canvas"
    description="Map the business model in one compact workspace with customer, value, channels, and revenue logic visible at the same time."
    icon={LayoutTemplate}
    toolType="business_canvas"
    summaryTitle="Canvas review"
    summaryBody="A good business canvas should read like a founder operating snapshot. Keep it specific enough that another person could challenge it."
    sections={[
      {
        title: "Customer and value",
        body: "Define the customer, the painful problem, and the clearest promise you make to them.",
        fields: [
          { name: "customer_segments", label: "Customer segments", placeholder: "Who is the primary customer?" },
          { name: "value_proposition", label: "Value proposition", placeholder: "Why should they choose you?", type: "textarea" },
          { name: "pain_point", label: "Core pain point", placeholder: "What painful job or friction are you solving?", type: "textarea" },
        ],
      },
      {
        title: "Delivery and channels",
        body: "Clarify how people discover you, how you deliver value, and what the relationship looks like after acquisition.",
        fields: [
          { name: "channels", label: "Channels", placeholder: "Instagram, direct outreach, partners, website" },
          { name: "customer_relationships", label: "Customer relationships", placeholder: "Self-serve, concierge, community-led" },
          { name: "key_activities", label: "Key activities", placeholder: "What do you have to do repeatedly to deliver value?", type: "textarea" },
        ],
      },
      {
        title: "Money and leverage",
        body: "Capture the revenue logic, cost base, and leverage points that make the model viable.",
        fields: [
          { name: "revenue_streams", label: "Revenue streams", placeholder: "Subscriptions, services, transactions" },
          { name: "cost_structure", label: "Cost structure", placeholder: "People, software, fulfillment, acquisition", type: "textarea" },
          { name: "key_resources", label: "Key resources", placeholder: "What assets or capabilities matter most?" },
        ],
      },
    ]}
    trailingPanel={
      <Surface className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <StickyNote className="h-4 w-4 text-primary" />
          Founder note
        </div>
        <p className="text-sm leading-7 text-muted-foreground">
          The strongest canvases are brutally clear. If a field feels generic, it probably needs real customer evidence behind it.
        </p>
      </Surface>
    }
  />
);

export default BusinessCanvas;
