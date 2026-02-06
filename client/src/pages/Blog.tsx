import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Calendar, Clock, User, ArrowRight, ShoppingCart } from "lucide-react";
import { Link } from "wouter";

const blogPosts = [
  {
    id: 1,
    title: "10 Ways AI Agents Can Transform Your Business Workflow",
    excerpt: "Discover how intelligent automation agents can handle repetitive tasks, make decisions, and free up your team to focus on strategic work that drives growth.",
    category: "Agent Workflows",
    author: "LNL Automations Team",
    date: "2026-02-01",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Voice Bots vs Chat Bots: Which is Right for Your Business?",
    excerpt: "Compare the benefits of voice-enabled AI assistants versus traditional chatbots. Learn which solution fits your customer service needs and budget.",
    category: "Voice & Chat Bots",
    author: "Sarah Mitchell",
    date: "2026-01-28",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Automating Social Media: How to Post Consistently Without Burnout",
    excerpt: "Master the art of social media automation with pre-built content packs, scheduling tools, and viral hooks that keep your audience engaged 24/7.",
    category: "Social Media",
    author: "Marcus Johnson",
    date: "2026-01-25",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Building Your First Personal Assistant Agent: A Step-by-Step Guide",
    excerpt: "Create an AI-powered personal assistant that manages your calendar, emails, and tasks. Perfect for entrepreneurs and busy professionals.",
    category: "Personal Assistant Agents",
    author: "Emily Rodriguez",
    date: "2026-01-22",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop",
  },
  {
    id: 5,
    title: "The ROI of Automation: Real Numbers from 50+ Businesses",
    excerpt: "Data-driven insights showing how automation investments pay off. See actual time savings, cost reductions, and productivity gains from real companies.",
    category: "Case Studies",
    author: "LNL Automations Team",
    date: "2026-01-18",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Creating Viral Social Media Content with AI-Generated Hooks",
    excerpt: "Learn the psychology behind viral content and how AI can help you craft irresistible hooks that stop the scroll and drive engagement.",
    category: "Social Media",
    author: "Sarah Mitchell",
    date: "2026-01-15",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=400&fit=crop",
  },
];

export default function Blog() {
  const { user, isAuthenticated } = useAuth();

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
            
            <div className="flex items-center gap-6">
              <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
                Products
              </Link>
              <Link href="/blog" className="text-sm font-medium text-primary transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/faq" className="text-sm font-medium hover:text-primary transition-colors">
                FAQ
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                    <User className="h-4 w-4" />
                    My Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                      Admin Panel
                    </Link>
                  )}
                </>
              ) : (
                <a href={getLoginUrl()} className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Login
                </a>
              )}
              
              <Link href="/cart">
                <Button size="sm" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Automation Insights & Resources
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Expert tips, tutorials, and case studies to help you master automation and scale your business
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 mb-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                    <span>•</span>
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Read
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Automate Your Workflow?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Browse our collection of automation products and start transforming your business today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg">Browse Products</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">Get Custom Solution</Button>
              </Link>
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
                <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                <li><Link href="/products?category=Agent%20Workflows" className="hover:text-primary transition-colors">Agent Workflows</Link></li>
                <li><Link href="/products?category=Voice%20%26%20Chat%20Bots" className="hover:text-primary transition-colors">Voice & Chat Bots</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
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
