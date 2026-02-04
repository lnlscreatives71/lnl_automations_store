import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function ProductDetail() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <a className="flex items-center gap-3">
                <img src="/logo.png" alt="LNL Automations" className="h-10 w-auto" />
                <span className="font-bold text-xl">LNL Automations</span>
              </a>
            </Link>
            <Link href="/products">
              <a>
                <Button variant="outline">Back to Products</Button>
              </a>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <Card>
          <CardContent className="p-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Product Detail Page</h1>
            <p className="text-muted-foreground mb-6">
              This page will display detailed product information. For the MVP, products can be purchased directly from the Products page.
            </p>
            <Link href="/products">
              <a>
                <Button>Browse Products</Button>
              </a>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
