import { ClipboardSignature, FilePenLine } from "lucide-react";
import { StructuredToolWorkbench } from "@/components/tool/StructuredToolWorkbench";
import { Surface } from "@/components/site/SitePrimitives";

const BusinessPlan = () => (
  <StructuredToolWorkbench
    eyebrow="Planning tool"
    title="Business plan builder"
    description="Build a readable business plan that covers the executive story, operating model, go-to-market logic, and the next 12 months."
    icon={ClipboardSignature}
    toolType="business_plan"
    summaryTitle="Business plan summary"
    summaryBody="Use the business plan to turn scattered founder thinking into one narrative a partner, mentor, or investor can scan quickly."
    sections={[
      {
        title: "Executive story",
        body: "Describe the business in a way that makes the problem, customer, and opportunity immediately clear.",
        fields: [
          { name: "problem_statement", label: "Problem statement", placeholder: "What is broken in the market today?", type: "textarea" },
          { name: "solution_summary", label: "Solution summary", placeholder: "What are you building and for whom?", type: "textarea" },
          { name: "target_customer", label: "Target customer", placeholder: "Who is the first customer segment?" },
        ],
      },
      {
        title: "Business model and market",
        body: "Explain how the business wins in the market and converts that into revenue.",
        fields: [
          { name: "market_positioning", label: "Market positioning", placeholder: "Why this wedge and why now?", type: "textarea" },
          { name: "revenue_model", label: "Revenue model", placeholder: "How does the business make money?" },
          { name: "go_to_market", label: "Go-to-market plan", placeholder: "How will customers discover and buy?", type: "textarea" },
        ],
      },
      {
        title: "Execution plan",
        body: "Clarify the milestones, numbers, and team assumptions for the next operating phase.",
        fields: [
          { name: "milestones", label: "12-month milestones", placeholder: "What must happen over the next 12 months?", type: "textarea" },
          { name: "financial_needs", label: "Financial needs", placeholder: "What resources or budget are required?", type: "textarea" },
          { name: "risks", label: "Top risks", placeholder: "What could slow down execution the most?", type: "textarea" },
        ],
      },
    ]}
    trailingPanel={
      <Surface className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FilePenLine className="h-4 w-4 text-primary" />
          Reviewer view
        </div>
        <p className="text-sm leading-7 text-muted-foreground">
          Write the plan so someone new to the business can understand the customer, revenue logic, and next milestones in one pass.
        </p>
      </Surface>
    }
  />
);

export default BusinessPlan;
