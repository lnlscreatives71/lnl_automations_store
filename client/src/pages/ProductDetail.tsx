import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Download, ShoppingCart } from "lucide-react";
import { ProductReviews } from "@/components/ProductReviews";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  const { addItem } = useCart();

  const { data: product, isLoading } = trpc.products.getById.useQuery(
    { id: productId },
    { enabled: productId > 0 }
  );

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast.success(`${product.name} added to cart`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b sticky top-0 z-50">
          <div className="container">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="LNL Automations" className="h-16 w-auto" />
                <span className="font-bold text-xl">LNL Automations</span>
              </Link>
              <Link href="/products">
                <Button variant="outline">Back to Products</Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="container py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-64 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b sticky top-0 z-50">
          <div className="container">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="LNL Automations" className="h-16 w-auto" />
                <span className="font-bold text-xl">LNL Automations</span>
              </Link>
              <Link href="/products">
                <Button variant="outline">Back to Products</Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="container py-12">
          <h1 className="text-3xl font-bold">Product Not Found</h1>
          <p className="text-muted-foreground mt-2">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="LNL Automations" className="h-16 w-auto" />
              <span className="font-bold text-xl">LNL Automations</span>
            </Link>
            <Link href="/products">
              <Button variant="outline">Back to Products</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold">{product.name}</h1>
                {product.type === "digital" && (
                  <Download className="h-6 w-6 text-primary" />
                )}
              </div>
              <p className="text-3xl font-bold text-primary">
                ${(product.price / 100).toFixed(2)}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Type</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="capitalize">{product.type}</p>
                {product.type === "digital" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Instant download after purchase
                  </p>
                )}
              </CardContent>
            </Card>

            <Button size="lg" className="w-full" onClick={handleAddToCart}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={productId} />
      </div>
    </div>
  );
}
