import { Presentation, TrendingUp } from "lucide-react";
import { StructuredToolWorkbench } from "@/components/tool/StructuredToolWorkbench";
import { Surface } from "@/components/site/SitePrimitives";

const PitchDeckBuilder = () => (
  <StructuredToolWorkbench
    eyebrow="Pitching tool"
    title="Pitch deck builder"
    description="Shape the investor story slide by slide with a tighter structure for problem, market, traction, business model, and the raise."
    icon={Presentation}
    toolType="pitch_deck"
    summaryTitle="Deck readiness"
    summaryBody="A strong deck gives investors the minimum story they need to trust the team, see momentum, and understand the raise."
    sections={[
      {
        title: "Problem and solution",
        body: "Anchor the story in a painful problem and a solution people can understand quickly.",
        fields: [
          { name: "problem", label: "Problem", placeholder: "What painful problem is worth solving?", type: "textarea" },
          { name: "solution", label: "Solution", placeholder: "How do you solve it better than the alternatives?", type: "textarea" },
        ],
      },
      {
        title: "Market and traction",
        body: "Show that the market is real and that the team has evidence of pull, not just a story.",
        fields: [
          { name: "market", label: "Market size and entry wedge", placeholder: "What segment are you winning first?", type: "textarea" },
          { name: "traction", label: "Traction proof", placeholder: "Revenue, pilots, growth, waitlist, retention", type: "textarea" },
          { name: "business_model", label: "Business model", placeholder: "How do you make money?" },
        ],
      },
      {
        title: "Team and raise",
        body: "Clarify why this team can execute and what the investment funds.",
        fields: [
          { name: "team", label: "Team edge", placeholder: "Why is this team credible?", type: "textarea" },
          { name: "raise", label: "Raise and use of funds", placeholder: "How much are you raising and what will it unlock?", type: "textarea" },
        ],
      },
    ]}
    trailingPanel={
      <Surface className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <TrendingUp className="h-4 w-4 text-primary" />
          Slide discipline
        </div>
        <p className="text-sm leading-7 text-muted-foreground">
          Investors reward narrative compression. If a point needs too much explanation, the slide is probably trying to do too much.
        </p>
      </Surface>
    }
  />
);

export default PitchDeckBuilder;
