import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function About() {
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
                <Button>Browse Products</Button>
              </a>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">About LNL Automations</h1>
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              LNL Automations specializes in providing cutting-edge digital products and automation solutions 
              designed to streamline workflows and boost productivity for businesses and individuals.
            </p>
            <p>
              Our portfolio includes premium templates, automation scripts, and custom solutions tailored 
              to meet the evolving needs of modern professionals.
            </p>
            <p>
              We are committed to delivering high-quality products backed by exceptional customer support.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
