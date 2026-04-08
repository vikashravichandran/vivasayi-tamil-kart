
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { language } = useApp();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="text-center">
        <div className="bg-vivasayi-green/10 p-4 rounded-full inline-flex mb-6">
          <span className="text-6xl">🌱</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-vivasayi-green">
          {language === "english" ? "404" : "404"}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {language === "english" 
            ? "Oops! This page seems to have been harvested already." 
            : "அடடா! இந்தப் பக்கம் ஏற்கனவே அறுவடை செய்யப்பட்டதுபோல் தெரிகிறது."}
        </p>
        <Link to="/">
          <Button className="bg-vivasayi-green hover:bg-vivasayi-teal">
            <Home size={18} className="mr-2" />
            {language === "english" ? "Return to Home" : "முகப்புக்குத் திரும்பு"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
