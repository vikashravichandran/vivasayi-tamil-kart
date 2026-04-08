
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { useApp } from "@/contexts/AppContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, Search, SlidersHorizontal, X } from "lucide-react";
import { useVoiceCommand } from "@/lib/voiceRecognition";
import { fetchProducts } from "@/lib/supabase";
import { Product } from "@/lib/types";

const ProductListing: React.FC = () => {
  const { language, addToCart } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const initialCategory = queryParams.get("category") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  
  // Fetch products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const productsData = await fetchProducts();
        setAllProducts(productsData);
        updateFilters(searchQuery, category, priceRange.min, priceRange.max, productsData);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Extract unique categories from products
  const categories = Array.from(new Set(allProducts.map(product => product.category)));
  
  const handleVoiceCommand = (command: string) => {
    if (command.startsWith("search")) {
      const searchTerm = command.replace("search", "").trim();
      setSearchQuery(searchTerm);
      updateFilters(searchTerm, category, priceRange.min, priceRange.max, allProducts);
    }
    setIsListening(false);
  };
  
  const { startListening, stopListening, isSupported } = useVoiceCommand(handleVoiceCommand);
  
  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);
    }
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(searchQuery, category, priceRange.min, priceRange.max, allProducts);
  };
  
  const updateFilters = (search: string, cat: string, minPrice: number, maxPrice: number, products: Product[]) => {
    // Update URL with search parameters without reloading the page
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (cat) params.set("category", cat);
    
    navigate(`/products?${params.toString()}`, { replace: true });
    
    // Filter products
    const filtered = products.filter(product => {
      const matchesSearch = search 
        ? (product.name.toLowerCase().includes(search.toLowerCase()) || 
          (product.nameInTamil || "").toLowerCase().includes(search.toLowerCase()) ||
          (product.description || "").toLowerCase().includes(search.toLowerCase()))
        : true;
        
      const matchesCategory = cat ? product.category === cat : true;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
    
    setFilteredProducts(filtered);
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setPriceRange({ min: 0, max: 1000 });
    navigate("/products", { replace: true });
    setFilteredProducts(allProducts);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {language === "english" ? "Products" : "தயாரிப்புகள்"}
      </h1>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder={language === "english" ? "Search products..." : "தயாரிப்புகளைத் தேடுங்கள்..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-16"
            />
            <div className="absolute right-3 top-2.5 flex space-x-1">
              {isSupported && (
                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`text-gray-400 hover:text-vivasayi-green ${isListening ? 'text-red-500' : ''}`}
                >
                  <Mic size={18} />
                </button>
              )}
              <button type="submit" className="text-gray-400 hover:text-vivasayi-green">
                <Search size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal size={16} className="mr-2" />
              {language === "english" ? "Filters" : "வடிகட்டிகள்"}
            </Button>
            
            {(searchQuery || category || priceRange.min > 0 || priceRange.max < 1000) && (
              <Button 
                type="button" 
                variant="ghost" 
                className="flex items-center"
                onClick={clearFilters}
              >
                <X size={16} className="mr-2" />
                {language === "english" ? "Clear Filters" : "வடிகட்டிகளை அழிக்க"}
              </Button>
            )}
          </div>
        </form>
        
        {/* Expanded Filters */}
        {isFilterOpen && (
          <div className="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "english" ? "Categories" : "வகைகள்"}
              </label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="">
                  {language === "english" ? "All Categories" : "அனைத்து வகைகளும்"}
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "english" ? "Min Price" : "குறைந்தபட்ச விலை"}
              </label>
              <Input
                type="number"
                min={0}
                max={priceRange.max}
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "english" ? "Max Price" : "அதிகபட்ச விலை"}
              </label>
              <Input
                type="number"
                min={priceRange.min}
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 1000 })}
                className="w-full"
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                type="button" 
                className="bg-vivasayi-green hover:bg-vivasayi-teal w-full"
                onClick={() => updateFilters(searchQuery, category, priceRange.min, priceRange.max, allProducts)}
              >
                {language === "english" ? "Apply Filters" : "வடிகட்டிகளை பயன்படுத்து"}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="text-center py-16">
          <p className="text-xl">
            {language === "english" ? "Loading products..." : "தயாரிப்புகளை ஏற்றுகிறது..."}
          </p>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredProducts.length} {language === "english" ? "products found" : "தயாரிப்புகள் கண்டுபிடிக்கப்பட்டன"}
            </p>
          </div>
          
          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">
                {language === "english" ? "No products found" : "எந்த தயாரிப்புகளும் கிடைக்கவில்லை"}
              </h3>
              <p className="text-gray-500 mb-6">
                {language === "english" 
                  ? "Try adjusting your search or filter criteria" 
                  : "உங்கள் தேடல் அல்லது வடிகட்டி அளவுருக்களை சரிசெய்ய முயற்சிக்கவும்"}
              </p>
              <Button onClick={clearFilters}>
                {language === "english" ? "Clear All Filters" : "அனைத்து வடிகட்டிகளையும் அழிக்கவும்"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductListing;
