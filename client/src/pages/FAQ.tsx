import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <a className="flex items-center gap-3">
                <img src="/logo.png" alt="LNL Automations" className="h-16 w-auto" />
                <span className="font-bold text-xl">LNL Automations</span>
              </a>
            </Link>
            <Link href="/products">
              <a>
                <Button>Browse Products</Button>
              </a>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I access my digital products after purchase?</AccordionTrigger>
            <AccordionContent>
              After completing your purchase, you can access your digital products from the My Orders page. 
              Each digital product will have a download link available for up to 30 days with a maximum of 5 downloads.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent>
              We accept all major credit cards and debit cards through our secure Stripe payment gateway.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>How long does shipping take for physical products?</AccordionTrigger>
            <AccordionContent>
              Physical products are typically processed within 1-2 business days. Shipping times vary based on your location 
              and the shipping method selected at checkout.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Can I get a refund?</AccordionTrigger>
            <AccordionContent>
              Please refer to our Refund Policy page for detailed information about refunds and returns.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Do you offer customer support?</AccordionTrigger>
            <AccordionContent>
              Yes! We provide email support for all customers. Please contact us through our Contact page 
              and we will respond within 24-48 hours.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
