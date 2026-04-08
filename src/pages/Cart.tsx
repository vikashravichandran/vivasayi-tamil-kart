
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { Minus, Plus, Trash2, ShoppingCart, X, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Cart: React.FC = () => {
  const { cart, updateCartItemQuantity, removeFromCart, clearCart, getCartTotal, language } = useApp();
  const navigate = useNavigate();
  const toast = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  
  const handleQuantityChange = (productId: string, quantity: number) => {
    updateCartItemQuantity(productId, quantity);
  };
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };
  
  const handleCheckout = () => {
    if (!cart.length) {
      toast.toast({
        title: language === "english" ? "Cart is empty" : "கார்ட் காலியாக உள்ளது",
        description: language === "english" 
          ? "Add some products to your cart before checkout" 
          : "செக்அவுட் செய்வதற்கு முன் உங்கள் கார்ட்டில் சில தயாரிப்புகளைச் சேர்க்கவும்",
        variant: "destructive"
      });
      return;
    }
    
    setIsCheckingOut(true);
  };
  
  const handlePlaceOrder = () => {
    if (!address) {
      toast.toast({
        title: language === "english" ? "Address is required" : "முகவரி தேவை",
        description: language === "english" 
          ? "Please provide a delivery address" 
          : "தயவுசெய்து ஒரு விநியோக முகவரியை வழங்கவும்",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send data to the backend
    toast.toast({
      title: language === "english" ? "Order Placed Successfully!" : "ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டது!",
      description: language === "english" 
        ? `Your order will be delivered to ${address}` 
        : `உங்கள் ஆர்டர் ${address} க்கு அனுப்பப்படும்`,
      variant: "default"
    });
    
    clearCart();
    navigate("/order-confirmation");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          {!isCheckingOut 
            ? (language === "english" ? "Your Shopping Cart" : "உங்கள் ஷாப்பிங் கார்ட்") 
            : (language === "english" ? "Checkout" : "செக்அவுட்")}
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingCart size={64} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              {language === "english" ? "Your cart is empty" : "உங்கள் கார்ட் காலியாக உள்ளது"}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === "english" 
                ? "Add some products to your cart to get started" 
                : "தொடங்குவதற்கு உங்கள் கார்ட்டில் சில தயாரிப்புகளைச் சேர்க்கவும்"}
            </p>
            <Link to="/products">
              <Button className="bg-vivasayi-green hover:bg-vivasayi-teal">
                {language === "english" ? "Browse Products" : "தயாரிப்புகளைப் பார்க்கவும்"}
              </Button>
            </Link>
          </div>
        ) : !isCheckingOut ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Cart Items */}
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.product.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center">
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg"; 
                      }}
                    />
                  </div>
                  
                  <div className="flex-grow md:ml-6 mt-4 md:mt-0">
                    <h3 className="font-medium">
                      {language === "english" ? item.product.name : item.product.nameInTamil || item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{item.product.farmerName}</p>
                  </div>
                  
                  <div className="flex items-center mt-4 md:mt-0">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:text-vivasayi-green"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:text-vivasayi-green"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:ml-6 mt-4 md:mt-0 flex justify-between items-center">
                    <div className="text-right">
                      <p className="font-semibold">₹{item.product.price * item.quantity}</p>
                      <p className="text-xs text-gray-500">
                        ₹{item.product.price} {language === "english" ? "per" : "ஒன்றுக்கு"} {item.product.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="ml-6 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cart Summary */}
            <div className="bg-gray-50 p-4 md:p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold">
                  {language === "english" ? "Subtotal" : "கூட்டுத்தொகை"}:
                </span>
                <span className="font-semibold text-xl">₹{getCartTotal()}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between">
                <Button 
                  variant="outline" 
                  className="mb-3 sm:mb-0"
                  onClick={() => navigate("/products")}
                >
                  <X size={16} className="mr-2" />
                  {language === "english" ? "Continue Shopping" : "ஷாப்பிங்கைத் தொடரவும்"}
                </Button>
                
                <Button 
                  className="bg-vivasayi-green hover:bg-vivasayi-teal"
                  onClick={handleCheckout}
                >
                  {language === "english" ? "Proceed to Checkout" : "செக்அவுட்டுக்குச் செல்லவும்"}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            {/* Checkout Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  {language === "english" ? "Delivery Address" : "விநியோக முகவரி"}
                </h3>
                <div className="space-y-4">
                  <Input
                    placeholder={language === "english" ? "Full Name" : "முழு பெயர்"}
                    className="w-full"
                  />
                  <Input
                    placeholder={language === "english" ? "Phone Number" : "தொலைபேசி எண்"}
                    className="w-full"
                  />
                  <Input
                    placeholder={language === "english" ? "Address Line 1" : "முகவரி வரி 1"}
                    className="w-full"
                  />
                  <Input
                    placeholder={language === "english" ? "Address Line 2" : "முகவரி வரி 2"}
                    className="w-full"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder={language === "english" ? "City" : "நகரம்"}
                    />
                    <Input
                      placeholder={language === "english" ? "Pincode" : "அஞ்சல் குறியீடு"}
                    />
                  </div>
                  <textarea
                    placeholder={language === "english" ? "Additional Instructions" : "கூடுதல் அறிவுறுத்தல்கள்"}
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows={3}
                  ></textarea>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  {language === "english" ? "Order Summary" : "ஆர்டர் சுருக்கம்"}
                </h3>
                
                <div className="border rounded-md p-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between py-2 border-b last:border-0">
                      <span>
                        {item.quantity} x {language === "english" ? item.product.name : item.product.nameInTamil || item.product.name}
                      </span>
                      <span>₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between font-semibold mt-4 pt-2 border-t">
                    <span>{language === "english" ? "Total" : "மொத்தம்"}:</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-4">
                  {language === "english" ? "Payment Method" : "கட்டண முறை"}
                </h3>
                
                <div className="space-y-2 mb-6">
                  <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">
                        {language === "english" ? "Cash on Delivery" : "டெலிவரியின் போது பணம் செலுத்துதல்"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {language === "english" ? "Pay when your order is delivered" : "உங்கள் ஆர்டர் விநியோகிக்கப்படும்போது பணம் செலுத்துங்கள்"}
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">
                        {language === "english" ? "Online Payment" : "ஆன்லைன் பணம் செலுத்துதல்"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {language === "english" ? "Pay now using credit/debit card or UPI" : "கிரெடிட்/டெபிட் கார்டு அல்லது UPI ஐப் பயன்படுத்தி இப்போது பணம் செலுத்துங்கள்"}
                      </p>
                    </div>
                  </label>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCheckingOut(false)}
                  >
                    {language === "english" ? "Back to Cart" : "கார்ட்டுக்குத் திரும்பு"}
                  </Button>
                  
                  <Button 
                    className="bg-vivasayi-green hover:bg-vivasayi-teal"
                    onClick={handlePlaceOrder}
                  >
                    {language === "english" ? "Place Order" : "ஆர்டரை உறுதிப்படுத்து"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
