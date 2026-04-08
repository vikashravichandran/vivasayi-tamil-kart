
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { useApp } from "@/contexts/AppContext";
import { ShoppingCart, Star, MapPin } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, addToCart } = useApp();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  // Default placeholder image if product image is not available
  const productImage = product.imageUrl || "/assets/placeholder.svg";

  return (
    <Card className="overflow-hidden card-hover hover:border-vivasayi-green">
      <div className="relative h-48 bg-gray-100">
        <img 
          src={productImage} 
          alt={product.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/assets/placeholder.svg"; // Fallback image
          }}
        />
        {product.rating && (
          <div className="absolute top-2 right-2 bg-vivasayi-orange text-white text-xs rounded-full px-2 py-1 flex items-center">
            <Star size={12} className="mr-1" fill="white" />
            {product.rating}
          </div>
        )}
      </div>
      <CardContent className="pt-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg">
            {language === "english" ? product.name : product.nameInTamil || product.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <span>{product.farmerName}</span>
            {product.location && (
              <div className="flex items-center ml-2">
                <MapPin size={12} className="mr-1" />
                <span>{product.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-vivasayi-green font-bold text-xl">₹{product.price}</p>
            <p className="text-sm text-gray-500">per {product.unit}</p>
          </div>
          <div className="text-sm text-gray-600">
            {language === "english" ? "Available:" : "கிடைக்கும்:"} {product.quantity} {product.unit}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          onClick={handleAddToCart} 
          className="w-full bg-vivasayi-green hover:bg-vivasayi-teal btn-hover-effect"
        >
          <ShoppingCart size={16} className="mr-2" />
          {language === "english" ? "Add to Cart" : "கார்ட்டில் சேர்"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
