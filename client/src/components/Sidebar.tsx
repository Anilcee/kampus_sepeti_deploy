import { useState, useEffect } from "react";
import type { Category } from "@shared/schema";

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
}

export default function Sidebar({ categories, selectedCategory, onCategoryChange, selectedGrade, onGradeChange }: SidebarProps) {
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [showGradeSelection, setShowGradeSelection] = useState(false);

  // Sınıf seçenekleri - Veritabanındaki kategori adlarına göre
  const gradeOptions = {
    "İlkokul": ["1. Sınıf", "2. Sınıf", "3. Sınıf", "4. Sınıf"],
    "Ortaokul": ["5. Sınıf", "6. Sınıf", "7. Sınıf", "8. Sınıf"],
    "Lise": ["9. Sınıf", "10. Sınıf", "11. Sınıf", "12. Sınıf"]
  };

  // Kategori değiştiğinde sınıf seçimini göster/gizle
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(cat => cat.id === selectedCategory);
      console.log("Selected category:", category); // Debug
      console.log("Category name:", category?.name); // Debug
      
      // Veritabanındaki kategori adına göre kontrol
      const isGradeCategory = category && gradeOptions[category.name as keyof typeof gradeOptions];
      
      console.log("Is grade category:", isGradeCategory); // Debug
      
      if (isGradeCategory) {
        setSelectedCategoryName(category.name);
        setShowGradeSelection(true);
        onGradeChange(""); // Kategori değiştiğinde sınıf seçimini sıfırla
        console.log("Grade selection enabled for:", category.name); // Debug
      } else {
        setSelectedCategoryName("");
        setShowGradeSelection(false);
        onGradeChange("");
        console.log("Grade selection disabled"); // Debug
      }
    } else {
      setSelectedCategoryName("");
      setShowGradeSelection(false);
      onGradeChange("");
    }
  }, [selectedCategory, categories, onGradeChange]);

  // Sınıf seçildiğinde ürünleri filtrele
  const handleGradeChange = (grade: string) => {
    onGradeChange(grade);
    console.log("Selected grade:", grade);
  };

  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow-md p-3 md:p-6 h-fit lg:sticky lg:top-24">
      <h2 className="font-bold text-base md:text-lg text-gray-800 mb-3 md:mb-4 border-b border-gray-200 pb-2">
        <i className="fas fa-list mr-2 text-primary"></i>Kategoriler
      </h2>

      {/* Categories */}
      <nav className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:space-y-2 lg:gap-0">
        {/* "All Products" button */}
        <div className="mb-2 lg:mb-0 col-span-2 lg:col-span-1">
          <button
            onClick={() => onCategoryChange(null)}
            className={`block w-full text-left font-semibold px-2 md:px-3 py-2 rounded-md transition-colors text-sm md:text-base ${
              selectedCategory === null
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
          <div key={category.id} className="mb-2 lg:mb-0">
            <button
              onClick={() => onCategoryChange(category.id)}
              className={`block w-full text-left font-semibold px-2 md:px-3 py-2 rounded-md transition-colors text-sm md:text-base ${
                selectedCategory === category.id
                  ? "text-primary bg-blue-50"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
              data-testid={`button-category-${category.slug}`}
            >
              <i className="fas fa-box mr-1 md:mr-2"></i>
              <span className="truncate">{category.name}</span>
            </button>
            
            {/* Sınıf seçenekleri - Ana kategorinin altında alt kategori gibi */}
            {showGradeSelection && 
             selectedCategory === category.id && 
             gradeOptions[category.name as keyof typeof gradeOptions] && (
              <div className="ml-4 mt-2 space-y-1">
                {gradeOptions[category.name as keyof typeof gradeOptions]?.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => handleGradeChange(grade)}
                    className={`block w-full text-left px-2 py-1 rounded text-xs text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors ${
                      selectedGrade === grade ? "text-primary bg-blue-50 font-medium" : ""
                    }`}
                  >
                    <i className="fas fa-chevron-right mr-1 text-xs"></i>
                    {grade}
                  </button>
                ))}
              </div>
            )}
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