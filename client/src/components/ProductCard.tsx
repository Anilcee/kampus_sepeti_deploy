import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import type { ProductWithCategory, User } from "@shared/schema";
import React, { useState, useEffect } from 'react';

// Turkish educational/study images from Unsplash
const productImages = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // students studying
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // books on desk
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // school supplies
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // teenagers studying
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // textbooks
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // students with notebooks
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // books on table
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // educational materials
];

interface ProductCardProps {
  product: ProductWithCategory;
  user?: User;
}

export default function ProductCard({ product, user }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId: product.id,
          quantity: 1
        }),
      });

      if (!response.ok) {
        throw new Error("Sepete eklenirken hata oluştu");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    try {
      await addToCartMutation.mutateAsync();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200" data-testid="product-card">
      <div className="relative">
        <img 
          src={product.imageUrl || productImages[Math.floor(Math.random() * productImages.length)]} 
          alt={product.name}
          className="w-full h-36 md:h-48 object-cover"
          data-testid="product-image"
        />
        {product.discountPercentage && product.discountPercentage > 0 && (
          <span className="absolute top-1 md:top-2 left-1 md:left-2 bg-accent text-white px-1 md:px-2 py-1 rounded-md text-xs md:text-sm font-bold">
            %{product.discountPercentage} İndirim
          </span>
        )}
        {product.hasCoaching && (
          <span className="absolute top-1 md:top-2 right-1 md:right-2 bg-green-500 text-white px-1 md:px-2 py-1 rounded-md text-xs font-medium">
            DENEME + KOÇLUK
          </span>
        )}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <i className="fas fa-eye text-primary"></i>
        </div>
      </div>

      <div className="p-3 md:p-4">
        <Link href={`/product/${product.slug}`}>
          <div className="mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.category?.name || 'Kategori'}
            </span>
          </div>
        </Link>

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm md:text-base cursor-pointer hover:text-primary transition-colors" data-testid="product-name">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="text-gray-500 line-through text-xs md:text-sm" data-testid={`text-original-price-${product.id}`}>
                {parseFloat(product.originalPrice || product.price).toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} TL
              </span>
            )}
            <span className="text-base md:text-lg font-bold text-primary" data-testid={`text-price-${product.id}`}>
              {parseFloat(product.price).toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} TL
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, index) => {
              const rating = parseFloat(product.rating || "0");
              return (
                <i 
                  key={index}
                  className={`text-sm ${
                    index < Math.floor(rating) 
                      ? "fas fa-star" 
                      : index < rating 
                      ? "fas fa-star-half-alt" 
                      : "far fa-star"
                  }`}
                ></i>
              );
            })}
            <span className="text-gray-600 text-xs md:text-sm ml-1">({product.reviewCount || 0})</span>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isLoading || addToCartMutation.isPending || !product.stock || product.stock <= 0}
          className="w-full btn-kampus-primary text-xs md:text-sm py-2 md:py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
          data-testid="add-to-cart-button"
        >
          {isLoading || addToCartMutation.isPending ? (
            <>
              <i className="fas fa-spinner fa-spin mr-1 md:mr-2"></i>
              Ekleniyor...
            </>
          ) : !product.stock || product.stock <= 0 ? (
            <>
              <i className="fas fa-times mr-1 md:mr-1"></i>
              Stokta Yok
            </>
          ) : (
            <>
              <i className="fas fa-shopping-cart mr-1 md:mr-2"></i>
              Sepete Ekle
            </>
          )}
        </Button>
      </div>
    </div>
  );
}