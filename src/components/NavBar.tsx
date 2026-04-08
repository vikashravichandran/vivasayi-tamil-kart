
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { useVoiceCommand } from "@/lib/voiceRecognition";
import { ShoppingCart, User, Menu, X, Search, Mic, Globe } from "lucide-react";

const NavBar: React.FC = () => {
  const { isLoggedIn, currentUser, cart, logout, toggleLanguage, language } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleVoiceCommand = (command: string) => {
    if (command.startsWith("search")) {
      const searchTerm = command.replace("search", "").trim();
      setSearchQuery(searchTerm);
      navigate(`/products?search=${searchTerm}`);
    } else if (command === "open cart") {
      navigate("/cart");
    } else if (command === "go to home") {
      navigate("/");
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
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl md:text-2xl text-vivasayi-green">
                Vivasayi<span className="text-vivasayi-orange">Kart</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative w-64">
              <input
                type="text"
                placeholder={language === "english" ? "Search products..." : "தயாரிப்புகளைத் தேடுங்கள்..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full py-2 pl-4 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-vivasayi-green"
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
            </form>

            <Button variant="ghost" onClick={toggleLanguage} className="flex items-center space-x-1">
              <Globe size={18} />
              <span>{language === "english" ? "தமிழ்" : "English"}</span>
            </Button>

            <Link to="/products">
              <Button variant="ghost">
                {language === "english" ? "Products" : "பொருட்கள்"}
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" className="relative">
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-vivasayi-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </Link>

            {isLoggedIn ? (
              <>
                <Link to={currentUser?.role === "farmer" ? "/farmer-dashboard" : "/consumer-dashboard"}>
                  <Button variant="ghost">
                    {language === "english" ? "Dashboard" : "டாஷ்போர்டு"}
                  </Button>
                </Link>
                <Button variant="outline" onClick={logout}>
                  {language === "english" ? "Logout" : "வெளியேறு"}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">
                    {language === "english" ? "Login" : "உள்நுழைய"}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" className="bg-vivasayi-green hover:bg-vivasayi-teal">
                    {language === "english" ? "Register" : "பதிவு செய்ய"}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="mr-4 relative">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-vivasayi-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-vivasayi-green focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <form onSubmit={handleSearch} className="relative mb-3">
              <input
                type="text"
                placeholder={language === "english" ? "Search products..." : "தயாரிப்புகளைத் தேடுங்கள்..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full py-2 pl-4 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-vivasayi-green"
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
            </form>

            <Button 
              variant="ghost" 
              onClick={toggleLanguage} 
              className="w-full justify-start"
            >
              <Globe size={18} className="mr-2" />
              {language === "english" ? "Switch to Tamil" : "ஆங்கிலத்திற்கு மாற்றவும்"}
            </Button>

            <Link to="/products" onClick={toggleMenu}>
              <Button variant="ghost" className="w-full justify-start">
                {language === "english" ? "Products" : "பொருட்கள்"}
              </Button>
            </Link>

            {isLoggedIn ? (
              <>
                <Link to={currentUser?.role === "farmer" ? "/farmer-dashboard" : "/consumer-dashboard"} onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    {language === "english" ? "Dashboard" : "டாஷ்போர்டு"}
                  </Button>
                </Link>
                <Button variant="ghost" onClick={() => { logout(); toggleMenu(); }} className="w-full justify-start">
                  {language === "english" ? "Logout" : "வெளியேறு"}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    {language === "english" ? "Login" : "உள்நுழைய"}
                  </Button>
                </Link>
                <Link to="/register" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    {language === "english" ? "Register" : "பதிவு செய்ய"}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
