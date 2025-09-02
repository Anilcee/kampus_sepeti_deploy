import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SimpleHeader from "@/components/SimpleHeader";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProductGrid from "@/components/ProductGrid";
import ShoppingCart from "@/components/ShoppingCart";
import { useAuth } from "@/hooks/useAuth";
import type { ProductWithCategory, Category } from "@shared/schema";

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [showCart, setShowCart] = useState(false);

  // Initialize categories
  useQuery({
    queryKey: ["/api/init"],
    staleTime: Infinity,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading: productsLoading, error } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products", selectedCategory, selectedGrade, searchQuery, sortBy],
    queryFn: async ({ queryKey }) => {
      const [, categoryId, grade, search, sort] = queryKey;
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId as string);
      if (grade) params.append("grade", grade as string);
      if (search) params.append("search", search as string);
      if (sort) params.append("sortBy", sort as string);

      const url = `/api/products?${params}`;

      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      const data = await response.json();
      return data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });


  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {user ? (
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCartClick={() => setShowCart(true)}
          user={user as any}
        />
      ) : (
        <SimpleHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCartClick={() => {
            // Redirect to login for cart access
            window.location.href = '/login';
          }}
        />
      )}

      {/* Breadcrumb */}
      <nav className="bg-gray-100 py-2 overflow-x-auto">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 min-w-max">
            <a href="#" className="hover:text-primary">Ana Sayfa</a>
            <i className="fas fa-chevron-right text-xs"></i>
            <a href="#" className="hover:text-primary">Ürünler</a>
            {selectedCategory && (
              <>
                <i className="fas fa-chevron-right text-xs"></i>
                <span className="text-primary font-medium">
                  {categories.find(c => c.id === selectedCategory)?.name || "Kategori"}
                </span>
                {selectedGrade && (
                  <>
                    <i className="fas fa-chevron-right text-xs"></i>
                    <span className="text-primary font-medium">
                      {selectedGrade}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-4 md:py-8 max-w-full">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 lg:flex-shrink-0">
            <Sidebar 
              categories={categories} 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedGrade={selectedGrade}
              onGradeChange={setSelectedGrade}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Category Header */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    {selectedCategory 
                      ? `${categories.find(c => c.id === selectedCategory)?.name} Deneme Kitapları`
                      : "Tüm Deneme Kitapları"
                    }
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base">
                    <span className="font-semibold" data-testid="text-product-count">
                      {products.length}
                    </span> sonuç listeleniyor
                  </p>
                </div>
                <div className="flex items-center">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto px-3 md:px-4 py-2 border border-gray-300 rounded-md focus:border-primary outline-none text-sm md:text-base"
                    data-testid="select-sort"
                  >
                    <option value="recommended">Önerilen Sıralama</option>
                    <option value="newest">Yeniden &gt; Eskiye</option>
                    <option value="oldest">Eskiden &gt; Yeniye</option>
                    <option value="price_asc">Ucuzdan &gt; Pahalıya</option>
                    <option value="price_desc">Pahalıdan &gt; Ucuza</option>
                    <option value="popular">En Çok Satılanlar</option>
                  </select>
                </div>
              </div>
            </div>

            <ProductGrid products={products} isLoading={productsLoading} user={user as any} />
          </div>
        </div>
      </main>

      {user && (
        <ShoppingCart 
          isOpen={showCart}
          onClose={() => setShowCart(false)}
        />
      )}

      {/* Admin Panel Access */}
      {user && (user as any)?.role === 'admin' && (
        <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-40 space-y-2 md:space-y-3">
          <div className="flex flex-col space-y-2">
            <a href="/sinav/admin">
              <button className="bg-green-600 text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors" data-testid="button-exam-admin-panel">
                <i className="fas fa-graduation-cap text-base md:text-lg"></i>
              </button>
            </a>
            <a href="/admin">
              <button className="bg-accent text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors" data-testid="button-admin-panel">
                <i className="fas fa-cog text-base md:text-lg"></i>
              </button>
            </a>
          </div>
        </div>
      )}

      {/* Exam System Access */}
      <div className="fixed bottom-4 md:bottom-6 left-4 md:left-6 z-40">
        <a href="/sinav">
          <button className="bg-blue-600 text-white px-3 md:px-4 py-2 md:py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center text-sm md:text-base" data-testid="button-exam-system">
            <i className="fas fa-clipboard-list mr-1 md:mr-2"></i>
            <span className="font-medium hidden sm:inline">Sınav Sistemi</span>
            <span className="font-medium sm:hidden">Sınav</span>
          </button>
        </a>
      </div>


      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-8 md:mt-12">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary text-white px-3 py-1 rounded font-bold text-sm md:text-base">
                  <i className="fas fa-graduation-cap mr-1"></i>
                  Kampüs Sepeti
                </div>
              </div>
              <p className="text-gray-400 text-xs md:text-sm">
                Türkiye'nin en güvenilir deneme kitabı ve eğitim materyalleri platformu.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Kategoriler</h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">İlkokul</a></li>
                <li><a href="#" className="hover:text-white">Ortaokul</a></li>
                <li><a href="#" className="hover:text-white">Lise</a></li>
                <li><a href="#" className="hover:text-white">YKS</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Müşteri Hizmetleri</h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">İletişim</a></li>
                <li><a href="#" className="hover:text-white">SSS</a></li>
                <li><a href="#" className="hover:text-white">İade ve Değişim</a></li>
                <li><a href="#" className="hover:text-white">Kargo Bilgileri</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">İletişim</h4>
              <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                <p><i className="fas fa-phone mr-2"></i>+90 212 000 00 00</p>
                <p><i className="fas fa-envelope mr-2"></i>info@kampussepeti.com</p>
                <div className="flex space-x-3 mt-3 md:mt-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <hr className="border-gray-700 my-6 md:my-8" />
          <div className="text-center text-xs md:text-sm text-gray-400">
            <p>&copy; 2025 Kampüs Sepeti. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}