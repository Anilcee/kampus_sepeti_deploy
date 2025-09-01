import type { Category } from "@shared/schema";

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null; // Changed to allow null for "All Products"
  onCategoryChange: (categoryId: string | null) => void; // Changed to allow null
}

export default function Sidebar({ categories, selectedCategory, onCategoryChange }: SidebarProps) {
  // The original logic for parent/child categories and filtering is removed as the new structure flattens the categories.
  // This assumes the categories prop now might need different handling or the new structure is preferred.
  // If the parent/child structure is still needed, a more complex refactor would be required.

  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow-md p-3 md:p-6 h-fit lg:sticky lg:top-24">
      <h2 className="font-bold text-base md:text-lg text-gray-800 mb-3 md:mb-4 border-b border-gray-200 pb-2">
        <i className="fas fa-list mr-2 text-primary"></i>Kategoriler
      </h2>

      {/* Categories */}
      <nav className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:space-y-2 lg:gap-0">
        {/* "All Products" button */}
        <div className="mb-2 lg:mb-0 col-span-2 lg:col-span-1"> {/* Adjusted margin and span for better spacing */}
          <button
            onClick={() => onCategoryChange(null)} // Pass null for "All Products"
            className={`block w-full text-left font-semibold px-2 md:px-3 py-2 rounded-md transition-colors text-sm md:text-base ${
              selectedCategory === null // Check for null
                ? "text-primary bg-blue-50"
                : "text-gray-700 hover:text-primary hover:bg-gray-50"
            }`}
            data-testid="button-all-products"
          >
            <i className="fas fa-book mr-1 md:mr-2"></i>
            <span className="hidden sm:inline">Tüm Ürünler</span>
            <span className="sm:hidden">Tümü</span>
          </button>
        </div>

        {/* Individual categories */}
        {categories.map((category) => (
          <div key={category.id} className="mb-2 lg:mb-0"> {/* Adjusted margin */}
            <button
              onClick={() => onCategoryChange(category.id)}
              className={`block w-full text-left font-semibold px-2 md:px-3 py-2 rounded-md transition-colors text-sm md:text-base ${
                selectedCategory === category.id
                  ? "text-primary bg-blue-50"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
              data-testid={`button-category-${category.slug}`}
            >
              <i className="fas fa-box mr-1 md:mr-2"></i> {/* Changed icon to be more generic for categories */}
              <span className="truncate">{category.name}</span>
            </button>
            {/* Removed nested child category rendering as the new structure is flattened. */}
            {/* If child categories need to be displayed, the 'categories' prop should include them and the mapping logic adjusted. */}
          </div>
        ))}
      </nav>

      {/* Price Filter */}
      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">
          <span className="mr-2 text-primary font-bold">₺</span>Fiyat Aralığı
        </h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input type="checkbox" className="w-4 h-4 text-primary" data-testid="checkbox-price-0-5000" />
            <label className="ml-2 text-xs md:text-sm text-gray-600">0 - 5.000 ₺</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="w-4 h-4 text-primary" data-testid="checkbox-price-5000-15000" />
            <label className="ml-2 text-xs md:text-sm text-gray-600">5.000 - 15.000 ₺</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="w-4 h-4 text-primary" data-testid="checkbox-price-15000-plus" />
            <label className="ml-2 text-xs md:text-sm text-gray-600">15.000 ₺ üzeri</label>
          </div>
        </div>
      </div>
    </aside>
  );
}