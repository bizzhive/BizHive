import { ShieldAlert, Swords } from "lucide-react";
import { StructuredToolWorkbench } from "@/components/tool/StructuredToolWorkbench";
import { Surface } from "@/components/site/SitePrimitives";

const SwotAnalysis = () => (
  <StructuredToolWorkbench
    eyebrow="Strategy tool"
    title="SWOT analysis"
    description="Break the business into strengths, weaknesses, opportunities, and threats without losing the bigger operating context."
    icon={Swords}
    toolType="swot_analysis"
    summaryTitle="SWOT scan"
    summaryBody="A useful SWOT should help you choose what to lean into, what to fix fast, and which external shifts matter most."
    sections={[
      {
        title: "Internal strengths",
        body: "Record the real advantages the team can already use in the market.",
        fields: [
          { name: "strengths", label: "Strengths", placeholder: "What do you already do unusually well?", type: "textarea" },
          { name: "assets", label: "Assets and unfair advantages", placeholder: "Distribution, expertise, network, data", type: "textarea" },
        ],
      },
      {
        title: "Internal weaknesses",
        body: "Be honest about gaps that could slow down trust, delivery, or growth.",
        fields: [
          { name: "weaknesses", label: "Weaknesses", placeholder: "Where are you fragile today?", type: "textarea" },
          { name: "bottlenecks", label: "Bottlenecks", placeholder: "What is most likely to stall the business next?", type: "textarea" },
        ],
      },
      {
        title: "External forces",
        body: "Capture what the outside world is giving you and what it may take away.",
        fields: [
          { name: "opportunities", label: "Opportunities", placeholder: "Which trends or openings can you exploit?", type: "textarea" },
          { name: "threats", label: "Threats", placeholder: "Which competitors, policies, or market shifts could hurt?", type: "textarea" },
        ],
      },
    ]}
    trailingPanel={
      <Surface className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ShieldAlert className="h-4 w-4 text-primary" />
          Decision lens
        </div>
        <p className="text-sm leading-7 text-muted-foreground">
          Use the SWOT to drive a real decision. A list is not enough unless it changes what you build, sell, or protect next.
        </p>
      </Surface>
    }
  />
);

export default SwotAnalysis;
