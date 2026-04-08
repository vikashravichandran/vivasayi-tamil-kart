
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import ProductCard from "@/components/ProductCard";
import { Truck, CheckCircle, ShieldCheck, Award, Mic } from "lucide-react";

const Home: React.FC = () => {
  const { products, language } = useApp();
  
  // Featured products (just taking the first 4 from our mock data for demo)
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {language === "english" 
                ? "Farm Fresh Products Directly to Your Home" 
                : "பண்ணையின் புதிய தயாரிப்புகள் நேரடியாக உங்கள் வீட்டிற்கு"}
            </h1>
            <p className="text-lg mb-6">
              {language === "english" 
                ? "Buy directly from local farmers at fair prices. Support local agriculture and get the freshest produce." 
                : "உள்ளூர் விவசாயிகளிடமிருந்து நேரடியாக நியாயமான விலைகளில் வாங்கவும். உள்ளூர் விவசாயத்தை ஆதரிக்கவும், புதிய பொருட்களைப் பெறவும்."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" className="bg-white text-vivasayi-green hover:bg-gray-100">
                  {language === "english" ? "Shop Now" : "இப்போது கடைக்கு செல்லுங்கள்"}
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-vivasayi-green"
                >
                  {language === "english" ? "Join as Farmer" : "விவசாயியாக இணையுங்கள்"}
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex items-center">
              <Mic size={24} className="mr-2" />
              <p className="text-sm">
                {language === "english" 
                  ? "Try voice search in Tamil! Click the mic icon and say \"தக்காளி காண்பி\"" 
                  : "தமிழில் குரல் தேடலை முயற்சிக்கவும்! மைக் ஐகானைக் கிளிக் செய்து \"தக்காளி காண்பி\" என்று சொல்லுங்கள்"}
              </p>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="relative">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <img 
                  src="/assets/farmers-collage.jpg" 
                  alt="Farmers with produce" 
                  className="rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-vivasayi-orange text-white p-4 rounded-lg shadow-lg">
                <p className="font-bold">
                  {language === "english" ? "Direct from Farmers" : "விவசாயிகளிடமிருந்து நேரடியாக"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {language === "english" ? "Why Choose VivasayiKart?" : "விவசாயி கார்ட்டை ஏன் தேர்வு செய்ய வேண்டும்?"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-vivasayi-green/10 p-3 rounded-full inline-flex mb-4">
                <CheckCircle size={28} className="text-vivasayi-green" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {language === "english" ? "Fresh Produce" : "புதிய தயாரிப்புகள்"}
              </h3>
              <p className="text-gray-600">
                {language === "english" 
                  ? "Harvested and delivered fresh from farms" 
                  : "பண்ணைகளில் இருந்து புதிதாக அறுவடை செய்து விநியோகிக்கப்படுகிறது"}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-vivasayi-green/10 p-3 rounded-full inline-flex mb-4">
                <Truck size={28} className="text-vivasayi-green" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {language === "english" ? "Fast Delivery" : "விரைவான விநியோகம்"}
              </h3>
              <p className="text-gray-600">
                {language === "english" 
                  ? "Quick delivery to your doorstep" 
                  : "உங்கள் வீட்டு வாசலுக்கு விரைவான விநியோகம்"}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-vivasayi-green/10 p-3 rounded-full inline-flex mb-4">
                <ShieldCheck size={28} className="text-vivasayi-green" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {language === "english" ? "Secure Payments" : "பாதுகாப்பான கட்டணங்கள்"}
              </h3>
              <p className="text-gray-600">
                {language === "english" 
                  ? "Cash on delivery option available" 
                  : "டெலிவரியின் போது பணம் செலுத்தும் வசதி உள்ளது"}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-vivasayi-green/10 p-3 rounded-full inline-flex mb-4">
                <Award size={28} className="text-vivasayi-green" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {language === "english" ? "Quality Assurance" : "தர உறுதி"}
              </h3>
              <p className="text-gray-600">
                {language === "english" 
                  ? "Verified farmers & quality products" 
                  : "சரிபார்க்கப்பட்ட விவசாயிகள் & தரமான தயாரிப்புகள்"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              {language === "english" ? "Featured Products" : "சிறப்பு தயாரிப்புகள்"}
            </h2>
            <Link to="/products">
              <Button variant="outline">
                {language === "english" ? "View All" : "அனைத்தையும் காண"}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-vivasayi-brown/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {language === "english" ? "Are You a Farmer?" : "நீங்கள் ஒரு விவசாயியா?"}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            {language === "english" 
              ? "Join our platform to sell your products directly to consumers. Get better prices and grow your business." 
              : "நுகர்வோருக்கு நேரடியாக உங்கள் தயாரிப்புகளை விற்க எங்கள் தளத்தில் இணையுங்கள். சிறந்த விலைகளைப் பெற்று உங்கள் வணிகத்தை வளர்த்துக் கொள்ளுங்கள்."}
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-vivasayi-green hover:bg-vivasayi-teal">
              {language === "english" ? "Register as Farmer" : "விவசாயியாக பதிவு செய்யுங்கள்"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">
                Vivasayi<span className="text-vivasayi-orange">Kart</span>
              </h3>
              <p className="text-gray-300">
                {language === "english" 
                  ? "Connecting farmers directly with consumers" 
                  : "விவசாயிகளை நேரடியாக நுகர்வோருடன் இணைக்கிறது"}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">
                {language === "english" ? "Quick Links" : "விரைவு இணைப்புகள்"}
              </h4>
              <ul className="space-y-2">
                <li><Link to="/products" className="hover:text-vivasayi-orange">{language === "english" ? "Products" : "தயாரிப்புகள்"}</Link></li>
                <li><Link to="/about" className="hover:text-vivasayi-orange">{language === "english" ? "About Us" : "எங்களைப் பற்றி"}</Link></li>
                <li><Link to="/contact" className="hover:text-vivasayi-orange">{language === "english" ? "Contact Us" : "எங்களை தொடர்பு கொள்ள"}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">
                {language === "english" ? "Contact" : "தொடர்பு"}
              </h4>
              <address className="not-italic text-gray-300">
                <p>Email: support@vivasayikart.com</p>
                <p>{language === "english" ? "Phone" : "தொலைபேசி"}: +91 98765 43210</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2025 VivasayiKart. {language === "english" ? "All rights reserved" : "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை"}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
