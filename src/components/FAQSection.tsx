
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection = ({ title, items }: { title?: string; items: FAQItem[] }) => (
  <div className="py-12">
    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{title || "Frequently Asked Questions"}</h2>
    <Accordion type="single" collapsible className="space-y-2">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
          <AccordionTrigger className="text-left text-sm md:text-base font-medium hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export default FAQSection;
