import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { User, CartItemWithProduct, ProductWithCategory } from "@shared/schema";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
  user?: User;
}

export default function Header({ searchQuery, onSearchChange, onCartClick, user }: HeaderProps) {
  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    enabled: !!user,
  });

  const { data: favoriteProducts = [] } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/favorites/products"],
    enabled: !!user,
  });

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md border-b-2 border-primary sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          <span className="font-medium">9.000 TL Üstüne Peşin Fiyatına 6 Taksit Avantajını Kaçırmayın!</span>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto px-2 md:px-4 py-2 md:py-3">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <a href="/" className="flex items-center hover:opacity-80 transition-opacity" data-testid="link-logo">
              <img 
                src="/logo.png" 
                alt="Kampüs Sepeti" 
                className="h-10 md:h-14 lg:h-16 w-auto"
                data-testid="img-logo"
              />
            </a>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-1 md:mx-4">
            <div className="relative">
              <input 
                type="search" 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Deneme kitabı ara..." 
                className="w-full px-2 md:px-4 py-2 md:py-3 pr-8 md:pr-12 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none text-sm md:text-base"
                data-testid="input-search"
              />
              <button className="absolute right-0 top-0 h-full px-2 md:px-4 bg-primary text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                <i className="fas fa-search text-sm md:text-base"></i>
              </button>
            </div>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-2 md:space-x-4 text-xs md:text-sm">
              {user ? (
                <div className="flex items-center space-x-1 md:space-x-2">
                  <span className="text-gray-600 truncate max-w-20 md:max-w-24 xl:max-w-none">Merhaba, {user.firstName || user.email}</span>
                  <Button
                    onClick={() => window.location.href = '/profile'}
                    variant="ghost"
                    size="sm"
                    data-testid="button-profile"
                    className="text-xs md:text-sm px-1 md:px-3"
                  >
                    <i className="fas fa-user mr-1"></i>
                    <span className="hidden lg:inline">Profilim</span>
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/api/logout'}
                    variant="ghost"
                    size="sm"
                    data-testid="button-logout"
                    className="text-xs md:text-sm px-1 md:px-3"
                  >
                    <span className="hidden lg:inline">Çıkış Yap</span>
                    <i className="fas fa-sign-out-alt lg:hidden"></i>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-1 md:space-x-2">
                  <a href="/login" className="text-gray-600 hover:text-primary transition-colors px-1 md:px-2 py-1 rounded text-xs md:text-sm">
                    <i className="fas fa-user mr-1"></i>
                    Giriş Yap
                  </a>
                  <span className="text-gray-400">|</span>
                  <a href="/register" className="text-gray-600 hover:text-primary transition-colors px-1 md:px-2 py-1 rounded text-xs md:text-sm">
                    Kayıt Ol
                  </a>
                </div>
              )}
            </div>

            {/* Mobile User Menu */}
            <div className="md:hidden flex items-center space-x-1">
              {user ? (
                <div className="flex items-center space-x-1">
                  <Button
                    onClick={() => window.location.href = '/profile'}
                    variant="ghost"
                    size="sm"
                    data-testid="button-profile-mobile"
                    className="p-1"
                  >
                    <i className="fas fa-user text-sm"></i>
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/api/logout'}
                    variant="ghost"
                    size="sm"
                    className="p-1"
                  >
                    <i className="fas fa-sign-out-alt text-sm"></i>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <a href="/login" className="text-gray-600 hover:text-primary transition-colors p-1 rounded text-xs flex items-center justify-center min-w-[3rem]">
                    <i className="fas fa-user text-sm mr-1"></i>
                    <span>Giriş</span>
                  </a>
                  <a href="/register" className="text-gray-600 hover:text-primary transition-colors p-1 rounded text-xs flex items-center justify-center min-w-[3rem]">
                    Kayıt
                  </a>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <a href="/favorites" className="relative p-1 md:p-2 text-gray-600 hover:text-primary transition-colors">
                <i className="fas fa-heart text-sm md:text-lg"></i>
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-3 h-3 md:w-5 md:h-5 flex items-center justify-center text-xs">{favoriteProducts.length}</span>
              </a>
              
              <button 
                onClick={onCartClick}
                className="relative p-1 md:p-2 text-gray-600 hover:text-primary transition-colors"
                data-testid="button-cart"
              >
                <i className="fas fa-shopping-cart text-sm md:text-lg"></i>
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-3 h-3 md:w-5 md:h-5 flex items-center justify-center text-xs" data-testid="text-cart-count">
                  {cartItemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
