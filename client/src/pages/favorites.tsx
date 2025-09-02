import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import SimpleHeader from "@/components/SimpleHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import type { ProductWithCategory } from "@shared/schema";

export default function FavoritesPage(): JSX.Element {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/favorites/products"],
    enabled: !!user,
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/favorites/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Favorilerden kaldırılırken hata oluştu");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites/products"] });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Sepete eklenirken hata oluştu");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <Header
          searchQuery=""
          onSearchChange={() => {}}
          onCartClick={() => {}}
          user={user as any}
        />
      ) : (
        <SimpleHeader
          searchQuery=""
          onSearchChange={() => {}}
          onCartClick={() => {}}
        />
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full mb-4">
              <i className="fas fa-heart text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Favorilerim</h1>
            <p className="text-gray-600">Beğendiğiniz ürünler burada toplanır</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
              <i className="fas fa-star text-sm"></i>
              <span className="font-medium">{products.length} ürün favorinizde</span>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              {(!user) && (
                <div className="text-center py-16">
                  <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <i className="fas fa-lock text-6xl text-gray-400"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Giriş Yapmanız Gerekiyor</h3>
                  <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                    Favorilerinizi görmek ve yönetmek için lütfen hesabınıza giriş yapın.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/login'} 
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <i className="fas fa-sign-in-alt mr-3"></i>
                    Giriş Yap
                  </Button>
                </div>
              )}

              {user && isLoading && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-6">
                    <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-600 text-lg">Favorileriniz yükleniyor...</p>
                </div>
              )}

              {user && !isLoading && (!products || products.length === 0) && (
                <div className="text-center py-16">
                  <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <i className="fas fa-heart text-6xl text-gray-300"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Henüz Favoriniz Yok</h3>
                  <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                    Beğendiğiniz ürünleri favorilere ekleyin, burada kolayca erişin ve takip edin.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/'} 
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <i className="fas fa-shopping-bag mr-3"></i>
                    Ürünlere Göz At
                  </Button>
                </div>
              )}

              {user && !isLoading && products.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((p) => (
                    <Card key={p.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                      <Link href={`/product/${p.slug as string}`}>
                        <div className="relative cursor-pointer">
                          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                            {p.imageUrl ? (
                              <img 
                                src={p.imageUrl as string} 
                                alt={p.name as string} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <i className="fas fa-book text-4xl text-gray-300"></i>
                              </div>
                            )}
                          </div>
                          
                          <div className="absolute top-3 right-3">
                            <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                              <i className="fas fa-heart text-red-500 text-sm"></i>
                            </div>
                          </div>

                          {(p.discountPercentage && p.discountPercentage > 0) ? (
                            <div className="absolute top-3 left-3">
                              <div className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                %{p.discountPercentage} İndirim
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </Link>

                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                            {p.category?.name as string}
                          </div>

                          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                            <a href={`/product/${p.slug as string}`}>
                              {p.name as string}
                            </a>
                          </h3>

                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary">
                              ₺{Number(p.price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₺{Number(p.originalPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button 
                              className="flex-1 bg-primary hover:bg-primary/90 text-white"
                              onClick={() => addToCartMutation.mutate({ productId: p.id, quantity: 1 })}
                              disabled={addToCartMutation.isPending}
                            >
                              <i className="fas fa-shopping-cart mr-2"></i>
                              Sepete Ekle
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeMutation.mutate(p.id)}
                              disabled={removeMutation.isPending}
                              className="text-red-500 border-red-200 hover:bg-red-50"
                            >
                              <i className="fas fa-heart-broken"></i>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


