
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductTable from "@/components/ProductTable";
import { Product } from "@/lib/types";
import { PlusCircle, Mic } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useVoiceCommand } from "@/lib/voiceRecognition";
import { fetchFarmerProducts, deleteProduct, fetchFarmerOrders } from "@/lib/supabase";

const FarmerDashboard: React.FC = () => {
  const { language, currentUser } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("products");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (currentUser?.id) {
      loadFarmerData();
    }
  }, [currentUser]);

  const loadFarmerData = async () => {
    if (!currentUser?.id) return;
    
    setIsLoading(true);
    
    try {
      // Load farmer's products
      const productsData = await fetchFarmerProducts(currentUser.id);
      setProducts(productsData);
      
      // Load farmer's orders
      const ordersData = await fetchFarmerOrders(currentUser.id);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading farmer data:", error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    const success = await deleteProduct(productId);
    if (success) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };
  
  // Handle product edit
  const handleEditProduct = (product: Product) => {
    navigate(`/edit-product/${product.id}`, { state: { product } });
  };
  
  // Voice command handler
  const handleVoiceCommand = (command: string) => {
    if (command === "add product" || command === "new product") {
      navigate("/add-product");
    } else if (command === "show orders") {
      setActiveTab("orders");
    } else if (command === "show products") {
      setActiveTab("products");
    } else if (command === "refresh data") {
      loadFarmerData();
    }
  };
  
  const { startListening } = useVoiceCommand(handleVoiceCommand);
  
  if (!currentUser || currentUser.role !== "farmer") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {language === "english" ? "Access Denied" : "அணுகல் மறுக்கப்பட்டது"}
        </h2>
        <p>
          {language === "english" 
            ? "You need to be logged in as a farmer to view this dashboard." 
            : "இந்த டாஷ்போர்டைப் பார்க்க நீங்கள் விவசாயியாக உள்நுழைய வேண்டும்."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === "english" ? "Farmer Dashboard" : "விவசாயி டாஷ்போர்டு"}
          </h1>
          <p className="text-gray-600">
            {language === "english" 
              ? `Welcome back, ${currentUser.name}` 
              : `மீண்டும் வரவேற்கிறோம், ${currentUser.name}`}
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button onClick={startListening} variant="outline" className="flex items-center gap-2">
            <Mic size={16} />
            {language === "english" ? "Voice Command" : "குரல் கட்டளை"}
          </Button>
          
          <Button 
            onClick={() => navigate("/add-product")}
            className="bg-vivasayi-green hover:bg-vivasayi-teal flex items-center gap-2"
          >
            <PlusCircle size={16} />
            {language === "english" ? "Add Product" : "தயாரிப்பைச் சேர்க்கவும்"}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="products">
            {language === "english" ? "Products" : "தயாரிப்புகள்"}
          </TabsTrigger>
          <TabsTrigger value="orders">
            {language === "english" ? "Orders" : "ஆர்டர்கள்"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === "english" ? "Your Products" : "உங்கள் தயாரிப்புகள்"}</CardTitle>
              <CardDescription>
                {language === "english" 
                  ? "Manage your product inventory, update details, and track stock levels." 
                  : "உங்கள் தயாரிப்பு சரக்குகளை நிர்வகிக்கவும், விவரங்களைப் புதுப்பிக்கவும் மற்றும் பங்கு அளவுகளைக் கண்காணிக்கவும்."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p>{language === "english" ? "Loading products..." : "தயாரிப்புகளை ஏற்றுகிறது..."}</p>
                </div>
              ) : products.length > 0 ? (
                <ProductTable 
                  products={products} 
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              ) : (
                <div className="text-center py-8">
                  <p>
                    {language === "english" 
                      ? "You haven't added any products yet." 
                      : "நீங்கள் இதுவரை எந்த தயாரிப்புகளையும் சேர்க்கவில்லை."}
                  </p>
                  <Button 
                    onClick={() => navigate("/add-product")} 
                    className="mt-4 bg-vivasayi-green hover:bg-vivasayi-teal"
                  >
                    {language === "english" ? "Add Your First Product" : "உங்கள் முதல் தயாரிப்பைச் சேர்க்கவும்"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === "english" ? "Recent Orders" : "சமீபத்திய ஆர்டர்கள்"}</CardTitle>
              <CardDescription>
                {language === "english" 
                  ? "View and manage orders from customers." 
                  : "வாடிக்கையாளர்களின் ஆர்டர்களைப் பார்க்கவும் மற்றும் நிர்வகிக்கவும்."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p>{language === "english" ? "Loading orders..." : "ஆர்டர்களை ஏற்றுகிறது..."}</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left py-4 px-6">{language === "english" ? "Order ID" : "ஆர்டர் ஐடி"}</th>
                        <th className="text-left py-4 px-6">{language === "english" ? "Date" : "தேதி"}</th>
                        <th className="text-left py-4 px-6">{language === "english" ? "Items" : "பொருட்கள்"}</th>
                        <th className="text-left py-4 px-6">{language === "english" ? "Total" : "மொத்தம்"}</th>
                        <th className="text-left py-4 px-6">{language === "english" ? "Status" : "நிலை"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-4 px-6">#{order.id}</td>
                          <td className="py-4 px-6">{order.orderDate}</td>
                          <td className="py-4 px-6">
                            {order.items.length} {language === "english" ? "items" : "பொருட்கள்"}
                          </td>
                          <td className="py-4 px-6">₹{order.totalAmount}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded text-xs ${
                              order.status === "delivered" ? "bg-green-100 text-green-800" :
                              order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                              order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  {language === "english" 
                    ? "No orders yet. Your orders will appear here when customers purchase your products." 
                    : "இதுவரை ஆர்டர்கள் இல்லை. வாடிக்கையாளர்கள் உங்கள் தயாரிப்புகளை வாங்கும்போது உங்கள் ஆர்டர்கள் இங்கே தோன்றும்."}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmerDashboard;
