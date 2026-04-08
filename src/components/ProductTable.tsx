
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Product } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ 
  products, 
  onEdit, 
  onDelete 
}) => {
  const { language } = useApp();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (productId: string) => {
    try {
      setDeleting(productId);
      
      // In a real app with backend integration, this would call an API
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      if (onDelete) {
        onDelete(productId);
      }
      
      toast({
        title: language === "english" ? "Product Deleted" : "தயாரிப்பு நீக்கப்பட்டது",
        description: language === "english" 
          ? "The product has been successfully removed" 
          : "தயாரிப்பு வெற்றிகரமாக அகற்றப்பட்டது",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        title: language === "english" ? "Error" : "பிழை",
        description: language === "english" 
          ? "Could not delete product. Please try again."
          : "தயாரிப்பை நீக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableCaption>
          {language === "english" ? "Your Product Inventory" : "உங்கள் தயாரிப்பு சரக்கு"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{language === "english" ? "Image" : "படம்"}</TableHead>
            <TableHead>{language === "english" ? "Name" : "பெயர்"}</TableHead>
            <TableHead>{language === "english" ? "Category" : "வகை"}</TableHead>
            <TableHead className="text-right">{language === "english" ? "Price" : "விலை"}</TableHead>
            <TableHead className="text-right">{language === "english" ? "Available" : "கிடைக்கும்"}</TableHead>
            <TableHead className="text-right">{language === "english" ? "Actions" : "செயல்கள்"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                {language === "english" 
                  ? "No products found. Add some products to get started!"
                  : "எந்த தயாரிப்புகளும் இல்லை. தொடங்குவதற்கு சில தயாரிப்புகளைச் சேர்க்கவும்!"}
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="h-12 w-12 rounded bg-gray-100 overflow-hidden">
                    <img 
                      src={product.imageUrl || "/placeholder.svg"} 
                      alt={product.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  {language === "english" 
                    ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
                    : product.category === "vegetables" 
                      ? "காய்கறிகள்" 
                      : product.category === "fruits" 
                        ? "பழங்கள்" 
                        : product.category === "grains" 
                          ? "தானியங்கள்" 
                          : product.category === "dairy" 
                            ? "பால் பொருட்கள்" 
                            : "மற்றவை"
                  }
                </TableCell>
                <TableCell className="text-right">₹{product.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {product.quantity} {product.unit}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <Button 
                        onClick={() => onEdit(product)} 
                        variant="outline" 
                        size="sm"
                      >
                        {language === "english" ? "Edit" : "திருத்து"}
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        onClick={() => handleDelete(product.id)}
                        variant="destructive"
                        size="sm"
                        disabled={deleting === product.id}
                      >
                        {deleting === product.id 
                          ? (language === "english" ? "Deleting..." : "நீக்குகிறது...") 
                          : (language === "english" ? "Delete" : "நீக்கு")
                        }
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
