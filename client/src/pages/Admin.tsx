import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Package } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getAllCategories, type ProductCategory } from "@shared/categories";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"digital" | "physical">("digital");
  const [category, setCategory] = useState<ProductCategory>("automated_workflows");
  const [imageUrl, setImageUrl] = useState("");
  const [digitalFileKey, setDigitalFileKey] = useState("");
  const [digitalFileName, setDigitalFileName] = useState("");

  const { data: products, isLoading, refetch } = trpc.products.list.useQuery();

  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully!");
      refetch();
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateProduct = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("Product updated successfully!");
      refetch();
      resetForm();
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteProduct = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setType("digital");
    setCategory("automated_workflows");
    setImageUrl("");
    setDigitalFileKey("");
    setDigitalFileName("");
    setSelectedProduct(null);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setName(product.name);
    setDescription(product.description || "");
    setPrice((product.price / 100).toString());
    setType(product.type);
    setCategory(product.category || "automated_workflows");
    setImageUrl(product.imageUrl || "");
    setDigitalFileKey(product.digitalFileKey || "");
    setDigitalFileName(product.digitalFileName || "");
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct.mutate({ id });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceInCents = Math.round(parseFloat(price) * 100);
    if (isNaN(priceInCents) || priceInCents <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const productData: any = {
      name: name.trim(),
      description: description.trim(),
      price: priceInCents,
      type,
      category,
    };
    
    if (imageUrl.trim()) productData.imageUrl = imageUrl.trim();
    if (type === "digital" && digitalFileKey.trim()) productData.digitalFileKey = digitalFileKey.trim();
    if (type === "digital" && digitalFileName.trim()) productData.digitalFileName = digitalFileName.trim();

    if (selectedProduct) {
      updateProduct.mutate({ id: selectedProduct.id, ...productData });
    } else {
      createProduct.mutate(productData);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You must be an admin to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
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
              <span className="font-bold text-xl">Admin Panel</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/orders">
                <Button variant="outline">View Orders</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Back to Store</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Product Management</h1>
            <p className="text-muted-foreground">Manage your digital and physical products</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Button>
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
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col">
                {product.imageUrl ? (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center rounded-t-lg">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <CardHeader className="flex-1">
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-primary">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground capitalize">
                      • {product.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleDelete(product.id, product.name)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first product</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {selectedProduct ? "Update product details below" : "Fill in the product details below"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="9.99"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Product Type *</Label>
                <Select value={type} onValueChange={(value: "digital" | "physical") => setType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={(value: ProductCategory) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAllCategories().map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">Select the category that best describes this product</p>
            </div>

            <div>
              <Label htmlFor="imageUrl">Product Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg or use manus-upload-file"
              />
              {imageUrl && (
                <div className="mt-2">
                  <img src={imageUrl} alt="Preview" className="h-32 w-32 object-cover rounded" />
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-1">Upload files using manus-upload-file command and paste the URL here</p>
            </div>

            {type === "digital" && (
              <>
                <div>
                  <Label htmlFor="digitalFileKey">Digital File Key</Label>
                  <Input
                    id="digitalFileKey"
                    value={digitalFileKey}
                    onChange={(e) => setDigitalFileKey(e.target.value)}
                    placeholder="products/file-abc123.zip"
                  />
                  <p className="text-sm text-muted-foreground mt-1">S3 file key from manus-upload-file</p>
                </div>
                <div>
                  <Label htmlFor="digitalFileName">Digital File Name</Label>
                  <Input
                    id="digitalFileName"
                    value={digitalFileName}
                    onChange={(e) => setDigitalFileName(e.target.value)}
                    placeholder="my-product.zip"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Display name for the downloadable file</p>
                </div>
              </>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
                {(createProduct.isPending || updateProduct.isPending) ? "Saving..." : (selectedProduct ? "Update Product" : "Create Product")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
