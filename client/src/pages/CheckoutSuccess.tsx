import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          {sessionId && (
            <p className="text-sm text-muted-foreground mb-6">
              Order ID: {sessionId.slice(-8)}
            </p>
          )}
          <div className="flex flex-col gap-2">
            <Link href="/orders">
              <a className="w-full">
                <Button className="w-full">View My Orders</Button>
              </a>
            </Link>
            <Link href="/products">
              <a className="w-full">
                <Button variant="outline" className="w-full">Continue Shopping</Button>
              </a>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
