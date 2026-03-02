import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, User, Package, Download, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();
  
  const newsletterMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setLocation('/products');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="LNL Automations" className="h-16 w-auto" />
              <span className="font-bold text-xl hidden md:inline">LNL Automations</span>
            </Link>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
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
            </form>
            
            <div className="flex items-center gap-4">
              <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">Products</Link>
              <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">Blog</Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
              <Link href="/faq" className="text-sm font-medium hover:text-primary transition-colors">FAQ</Link>
              
              {isAuthenticated ? (
                <>
                  <Link href="/orders">
                    <Button variant="ghost" size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </Button>
                  </Link>
                  {user?.role === "admin" && (
                    <Link href="/admin">
                      <Button variant="outline" size="sm">Admin Panel</Button>
                    </Link>
                  )}
                  <Link href="/cart">
                    <Button size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/cart">
                    <Button variant="ghost" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart
                    </Button>
                  </Link>
                  <a href={getLoginUrl()}>
                    <Button size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#8a50f1] via-[#b440c4] via-[#d154b3] to-[#efa536]"
          style={{
            background: 'linear-gradient(135deg, #8a50f1 0%, #b440c4 25%, #d154b3 50%, #de387f 75%, #efa536 100%)'
          }}
        />
        <div className="relative container py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center text-white">
            <img src="/logo.png" alt="LNL Automations Studio" className="h-48 w-auto mx-auto mb-8" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Digital Products & Automation Solutions
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Discover cutting-edge digital tools, templates, and automation solutions designed to streamline your workflow and boost productivity.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  Browse Products
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our collection of digital products and physical automation solutions
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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
              {products.slice(0, 6).map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  {product.imageUrl && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                      {product.type === "digital" && (
                        <Download className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    <Link href={`/products/${product.id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No products available yet. Check back soon!</p>
            </div>
          )}

          {products && products.length > 6 && (
            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg" variant="outline">View All Products</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See Our Products in Action</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch how our automation solutions transform workflows and boost productivity
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Package className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-sm">Product demo video placeholder</p>
                  <p className="text-xs mt-2 opacity-80">Upload your product videos/GIFs here</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle>Agent Workflows Demo</CardTitle>
                <CardDescription>See how AI agents automate complex business processes</CardDescription>
              </CardHeader>
            </Card>
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Download className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-sm">Product demo video placeholder</p>
                  <p className="text-xs mt-2 opacity-80">Upload your product videos/GIFs here</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle>Voice Bot Integration</CardTitle>
                <CardDescription>Watch voice assistants handle customer inquiries</CardDescription>
              </CardHeader>
            </Card>
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-sm">Product demo video placeholder</p>
                  <p className="text-xs mt-2 opacity-80">Upload your product videos/GIFs here</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle>Automation Templates</CardTitle>
                <CardDescription>Pre-built workflows ready to deploy in minutes</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of satisfied customers who have transformed their businesses with our automation solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <CardTitle>Sarah Mitchell</CardTitle>
                <CardDescription>Marketing Director, TechFlow Inc.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "The automated workflows from LNL Automations saved our team 20+ hours per week. The voice bot integration was seamless and our customer satisfaction scores increased by 35%. Absolutely worth every penny!"
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <CardTitle>Marcus Johnson</CardTitle>
                <CardDescription>CEO, Digital Solutions Pro</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "I purchased three agent workflow templates and they paid for themselves in the first month. The quality is exceptional and the support team is incredibly responsive. Highly recommend for any business looking to scale!"
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <CardTitle>Emily Rodriguez</CardTitle>
                <CardDescription>Operations Manager, CloudVenture</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "The social media content packs are a game-changer! We went from spending 10 hours a week on content creation to just 2 hours. The viral hooks actually work - our engagement tripled in 30 days. Thank you LNL Automations!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Digital Downloads</h3>
              <p className="text-muted-foreground">
                Get immediate access to your digital products after purchase. Download anytime from your order history.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                <Package className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Physical Products</h3>
              <p className="text-muted-foreground">
                Custom automation hardware and physical solutions delivered directly to your door.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Checkout</h3>
              <p className="text-muted-foreground">
                Safe and secure payment processing powered by Stripe. Your data is always protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t mt-auto">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src="/logo.png" alt="LNL Automations" className="h-10 w-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Premium digital products and automation solutions for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
                <li><Link href="/products?type=digital" className="hover:text-foreground transition-colors">Digital Downloads</Link></li>
                <li><Link href="/products?type=physical" className="hover:text-foreground transition-colors">Physical Products</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                {isAuthenticated && user?.role === "admin" && (
                  <li><Link href="/admin" className="hover:text-foreground transition-colors">Admin Panel</Link></li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="border-t mt-8 pt-8">
            <div className="max-w-md mx-auto text-center">
              <h4 className="font-semibold mb-2">Stay Updated</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter for product updates, automation tips, and exclusive offers.
              </p>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get('email') as string;
                if (email) {
                  newsletterMutation.mutate({ email });
                  e.currentTarget.reset();
                }
              }} className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button type="submit" disabled={newsletterMutation.isPending}>
                  {newsletterMutation.isPending ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} LNL Automations Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
