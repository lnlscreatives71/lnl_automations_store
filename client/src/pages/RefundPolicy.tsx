import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function RefundPolicy() {
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
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        <Card>
          <CardHeader>
            <CardTitle>Our Commitment to Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Digital Products</h3>
              <p>
                Due to the nature of digital products, all sales are final once the product has been downloaded. 
                However, if you experience technical issues or the product does not match its description, 
                please contact us within 7 days of purchase for assistance.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Physical Products</h3>
              <p>
                Physical products may be returned within 14 days of delivery for a full refund, provided they are 
                in original condition and packaging. Return shipping costs are the responsibility of the customer 
                unless the product is defective or incorrect.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">How to Request a Refund</h3>
              <p>
                To request a refund, please contact our support team at support@lnlautomations.cloud with your 
                order number and reason for the refund request. We will process approved refunds within 5-7 business days.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
