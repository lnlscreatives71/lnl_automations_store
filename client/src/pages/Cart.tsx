import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const createCheckoutSession = trpc.checkout.createSession.useMutation();

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const cartItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const { url } = await createCheckoutSession.mutateAsync({ items: cartItems });
      
      // Open Stripe checkout in new tab
      window.open(url, '_blank');
      toast.success("Redirecting to checkout...");
    } catch (error: any) {
      toast.error(error.message || "Failed to create checkout session");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                <Button variant="outline">Continue Shopping</Button>
              </a>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        {items.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some products to get started!</p>
              <Link href="/products">
                <a>
                  <Button>Browse Products</Button>
                </a>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.product.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {item.product.imageUrl && (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{item.product.description}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.product.type === "digital" ? "Digital Download" : "Physical Product"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">${(item.product.price / 100).toFixed(2)} each</p>
                            <p className="text-lg font-bold text-primary">
                              ${((item.product.price * item.quantity) / 100).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${(totalPrice / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${(totalPrice / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={createCheckoutSession.isPending}
                  >
                    {createCheckoutSession.isPending ? "Processing..." : "Proceed to Checkout"}
                  </Button>
                  <Link href="/products">
                    <a className="w-full">
                      <Button variant="outline" className="w-full">Continue Shopping</Button>
                    </a>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
