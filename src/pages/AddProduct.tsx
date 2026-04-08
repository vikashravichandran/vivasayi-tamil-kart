
import React from "react";
import { useApp } from "@/contexts/AppContext";
import AddProductForm from "@/components/AddProductForm";
import { useVoiceCommand } from "@/lib/voiceRecognition";
import { useNavigate } from "react-router-dom";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddProduct: React.FC = () => {
  const { currentUser, language } = useApp();
  const navigate = useNavigate();

  // Handle voice commands for navigation
  const handleVoiceCommand = (command: string) => {
    if (command === "go to farmer dashboard") {
      navigate("/farmer-dashboard");
    } else if (command === "go to home") {
      navigate("/");
    } else if (command === "go to products") {
      navigate("/products");
    }
  };
  
  const { startListening, isSupported } = useVoiceCommand(handleVoiceCommand);

  if (!currentUser || currentUser.role !== "farmer") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {language === "english" ? "Access Denied" : "அணுகல் மறுக்கப்பட்டது"}
        </h2>
        <p>
          {language === "english" 
            ? "You need to be logged in as a farmer to add products." 
            : "தயாரிப்புகளைச் சேர்க்க நீங்கள் விவசாயியாக உள்நுழைய வேண்டும்."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold mb-2">
            {language === "english" ? "Add New Product" : "புதிய தயாரிப்பைச் சேர்க்கவும்"}
          </h1>
          <p className="text-gray-600">
            {language === "english" 
              ? "List your farm products for consumers to purchase" 
              : "நுகர்வோர் வாங்குவதற்கு உங்கள் பண்ணை தயாரிப்புகளைப் பட்டியலிடுங்கள்"}
          </p>
        </div>
        
        {isSupported && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={startListening}
            className="flex items-center gap-2"
          >
            <Mic size={16} />
            {language === "english" ? "Voice Navigation" : "குரல் வழிசெலுத்தல்"}
          </Button>
        )}
      </div>
      
      <AddProductForm />
    </div>
  );
};

export default AddProduct;
