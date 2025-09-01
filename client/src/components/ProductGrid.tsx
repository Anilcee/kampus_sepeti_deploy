import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductWithCategory, User } from "@shared/schema";

interface ProductGridProps {
  products: ProductWithCategory[];
  isLoading: boolean;
  user?: User;
}

export default function ProductGrid({ products, isLoading, user }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton className="w-full h-32 sm:h-36 md:h-48" />
            <div className="p-3 md:p-4 space-y-2 md:space-y-3">
              <Skeleton className="h-3 md:h-4 w-full" />
              <Skeleton className="h-3 md:h-4 w-3/4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 md:h-5 w-12 md:w-16" />
                <Skeleton className="h-5 md:h-6 w-16 md:w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <i className="fas fa-search text-3xl md:text-4xl text-gray-400 mb-3 md:mb-4"></i>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Ürün Bulunamadı</h3>
          <p className="text-gray-600 text-sm md:text-base">Seçtiğiniz kriterlere uygun ürün bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} user={user} />
      ))}
    </div>
  );
}