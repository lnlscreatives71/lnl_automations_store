import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Download, ShoppingCart, Search, Star, Filter } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getAllCategories, getCategoryDisplayName, type ProductCategory } from "@shared/categories";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Product Rating Component
function ProductRating({ productId }: { productId: number }) {
  const { data: rating } = trpc.reviews.getAverageRating.useQuery({ productId });
  
  if (!rating || rating.count === 0) return null;
  
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating.average)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {rating.average.toFixed(1)} ({rating.count})
      </span>
    </div>
  );
}

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  
  const { data: allProducts, isLoading } = trpc.products.search.useQuery({ query: debouncedSearch });
  
  // Filter products by category
  const products = selectedCategory === 'all' 
    ? allProducts 
    : allProducts?.filter(p => p.category === selectedCategory);
  const { addItem } = useCart();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update search when URL changes
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchQuery(urlSearch);
    setDebouncedSearch(urlSearch);
  }, [location]);

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen">
      {/* Simple header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="LNL Automations" className="h-16 w-auto" />
              <span className="font-bold text-xl hidden md:inline">LNL Automations</span>
            </Link>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>
            
            <Link href="/cart">
              <Button>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">
              {debouncedSearch ? `Search Results for "${debouncedSearch}"` : 'All Products'}
            </h1>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={(value: ProductCategory | 'all') => setSelectedCategory(value)}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getAllCategories().map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            {debouncedSearch 
              ? `Found ${products?.length || 0} product${products?.length === 1 ? '' : 's'}`
              : selectedCategory !== 'all'
              ? `Showing ${products?.length || 0} product${products?.length === 1 ? '' : 's'} in ${getCategoryDisplayName(selectedCategory)}`
              : 'Browse our complete collection of digital and physical products'
            }
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow flex flex-col">
                {product.imageUrl && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryDisplayName(product.category)}
                    </Badge>
                    {product.type === "digital" && (
                      <Download className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  <ProductRating productId={product.id} />
                </CardHeader>
                <CardFooter className="flex flex-col gap-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-2xl font-bold text-primary">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    <Link href={`/products/${product.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {debouncedSearch 
                ? `No products found matching "${debouncedSearch}"`
                : 'No products available yet.'
              }
            </p>
            {debouncedSearch && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
