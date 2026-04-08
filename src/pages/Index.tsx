
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { language, isLoggedIn, currentUser, products, toggleLanguage } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-4xl animate-fade-in shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">
            {language === "english" ? "Vivasayi" : "விவசாயி"}
          </CardTitle>
          <CardDescription className="text-xl">
            {language === "english" 
              ? "Direct from farmers to your home" 
              : "விவசாயிகளிடமிருந்து நேரடியாக உங்கள் வீட்டிற்கு"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="mb-6">
            {language === "english" 
              ? "Welcome to the Vivasayi marketplace - connecting farmers directly with consumers." 
              : "விவசாயி சந்தைக்கு வரவேற்கிறோம் - விவசாயிகளை நுகர்வோருடன் நேரடியாக இணைக்கிறது."}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button 
              onClick={() => navigate('/products')} 
              className="bg-vivasayi-green hover:bg-vivasayi-teal"
            >
              {language === "english" ? "Browse Products" : "பொருட்களைப் பார்வையிடவும்"}
            </Button>
            
            {!isLoggedIn ? (
              <>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="bg-vivasayi-green hover:bg-vivasayi-teal"
                >
                  {language === "english" ? "Login" : "உள்நுழைய"}
                </Button>
                <Button 
                  onClick={() => navigate('/register')} 
                  variant="outline" 
                  className="border-vivasayi-green text-vivasayi-green hover:bg-vivasayi-green hover:text-white"
                >
                  {language === "english" ? "Register" : "பதிவு செய்ய"}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate(currentUser?.role === 'farmer' ? '/farmer-dashboard' : '/consumer-dashboard')} 
                className="bg-vivasayi-green hover:bg-vivasayi-teal"
              >
                {language === "english" ? "Go to Dashboard" : "டாஷ்போர்டுக்குச் செல்லவும்"}
              </Button>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button 
            onClick={toggleLanguage} 
            variant="ghost" 
            className="text-gray-600"
          >
            {language === "english" ? "தமிழில் காட்டு" : "Show in English"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
