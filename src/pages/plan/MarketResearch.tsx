import { SearchCheck, Users2 } from "lucide-react";
import { StructuredToolWorkbench } from "@/components/tool/StructuredToolWorkbench";
import { Surface } from "@/components/site/SitePrimitives";

const MarketResearch = () => (
  <StructuredToolWorkbench
    eyebrow="Planning tool"
    title="Market research workspace"
    description="Capture customer demand, competitor positioning, and buying behavior in one structured research view that you can keep refining."
    icon={SearchCheck}
    toolType="market_research"
    summaryTitle="Research summary"
    summaryBody="Market research should change decisions. Use this workspace to reduce guesswork about customers, pricing, and competitor alternatives."
    sections={[
      {
        title: "Customer understanding",
        body: "Define who the customer is, what triggers the search, and how urgent the problem feels.",
        fields: [
          { name: "customer_profile", label: "Customer profile", placeholder: "Who is the ideal buyer?" },
          { name: "customer_problem", label: "Customer problem", placeholder: "What is the core pain they feel?", type: "textarea" },
          { name: "buying_trigger", label: "Buying trigger", placeholder: "What makes them look for a solution now?" },
        ],
      },
      {
        title: "Competitor and substitute map",
        body: "Look beyond direct competitors and note what customers currently do instead.",
        fields: [
          { name: "direct_competitors", label: "Direct competitors", placeholder: "Which products or businesses compete directly?", type: "textarea" },
          { name: "substitutes", label: "Substitutes", placeholder: "Spreadsheets, freelancers, manual workflows, agencies", type: "textarea" },
          { name: "price_benchmark", label: "Price benchmark", placeholder: "How is the market pricing today?" },
        ],
      },
      {
        title: "Decision framing",
        body: "Summarize what the research means for your pricing, messaging, and next experiment.",
        fields: [
          { name: "messaging", label: "Messaging insight", placeholder: "What language seems to resonate best?", type: "textarea" },
          { name: "pricing_hypothesis", label: "Pricing hypothesis", placeholder: "What price direction seems credible?" },
          { name: "next_test", label: "Next test", placeholder: "What should you validate next?" },
        ],
      },
    ]}
    trailingPanel={
      <Surface className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Users2 className="h-4 w-4 text-primary" />
          Customer signal
        </div>
        <p className="text-sm leading-7 text-muted-foreground">
          The best research notes preserve the words customers use. Keep insight close to actual language instead of generic analysis.
        </p>
      </Surface>
    }
  />
);

export default MarketResearch;
