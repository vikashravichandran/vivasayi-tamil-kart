import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useApp } from "@/contexts/AppContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Upload, Mic } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/lib/types";
import { useVoiceCommand } from "@/lib/voiceRecognition";

interface ProductFormData {
  name: string;
  nameInTamil?: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  harvestDate?: string;
  imageUrl?: string;
}

const AddProductForm: React.FC = () => {
  const { language, currentUser } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      nameInTamil: "",
      description: "",
      category: "vegetables",
      price: 0,
      quantity: 0,
      unit: "kg",
    }
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app with backend, we'd upload this file to a server
      // For now, we'll just create a URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      
      // In a real app with backend integration, this is where we would upload data to a server
      // For now, we'll just simulate success and show a toast
      
      // Add image URL if available
      if (imagePreview) {
        data.imageUrl = imagePreview;
      }

      console.log("Product data to be sent to backend:", data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: language === "english" ? "Product Added" : "தயாரிப்பு சேர்க்கப்பட்டது",
        description: language === "english" 
          ? "Your product has been successfully added" 
          : "உங்கள் தயாரிப்பு வெற்றிகரமாக சேர்க்கப்பட்டது",
      });
      
      // Reset form
      form.reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: language === "english" ? "Error" : "பிழை",
        description: language === "english"
          ? "Failed to add product. Please try again."
          : "தயாரிப்பைச் சேர்க்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle voice commands for product form
  const handleVoiceCommand = (command: string) => {
    if (command.startsWith("set name")) {
      const name = command.replace("set name", "").trim();
      form.setValue("name", name);
    } else if (command.startsWith("set price")) {
      const priceText = command.replace("set price", "").trim();
      const price = parseFloat(priceText);
      if (!isNaN(price)) {
        form.setValue("price", price);
      }
    } else if (command.startsWith("set quantity")) {
      const quantityText = command.replace("set quantity", "").trim();
      const quantity = parseFloat(quantityText);
      if (!isNaN(quantity)) {
        form.setValue("quantity", quantity);
      }
    } else if (command === "submit form") {
      form.handleSubmit(onSubmit)();
    }
  };
  
  const { startListening, isSupported } = useVoiceCommand(handleVoiceCommand);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {language === "english" ? "Add New Product" : "புதிய தயாரிப்பைச் சேர்க்கவும்"}
          </h2>
          
          {isSupported && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={startListening}
              className="flex items-center gap-2"
            >
              <Mic size={16} />
              {language === "english" ? "Voice Input" : "குரல் உள்ளீடு"}
            </Button>
          )}
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === "english" ? "Product Name" : "தயாரிப்பு பெயர்"} *</FormLabel>
                    <FormControl>
                      <Input placeholder={language === "english" ? "Enter product name" : "தயாரிப்பு பெயரை உள்ளிடவும்"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nameInTamil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === "english" ? "Tamil Name" : "தமிழ் பெயர்"}</FormLabel>
                    <FormControl>
                      <Input placeholder={language === "english" ? "Enter Tamil name" : "தமிழ் பெயரை உள்ளிடவும்"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === "english" ? "Category" : "வகை"} *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={language === "english" ? "Select a category" : "ஒரு வகையைத் தேர்ந்தெடுக்கவும்"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vegetables">{language === "english" ? "Vegetables" : "காய்கறிகள்"}</SelectItem>
                        <SelectItem value="fruits">{language === "english" ? "Fruits" : "பழங்கள்"}</SelectItem>
                        <SelectItem value="grains">{language === "english" ? "Grains" : "தானியங்கள்"}</SelectItem>
                        <SelectItem value="dairy">{language === "english" ? "Dairy" : "பால் பொருட்கள்"}</SelectItem>
                        <SelectItem value="other">{language === "english" ? "Other" : "மற்றவை"}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === "english" ? "Price (₹)" : "விலை (₹)"} *</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === "english" ? "Unit" : "அலகு"} *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={language === "english" ? "Select unit" : "அலகைத் தேர்ந்தெடுக்கவும்"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="item">{language === "english" ? "Item" : "பொருள்"}</SelectItem>
                          <SelectItem value="dozen">{language === "english" ? "Dozen" : "டஜன்"}</SelectItem>
                          <SelectItem value="liter">{language === "english" ? "Liter" : "லிட்டர்"}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "english" ? "Quantity Available" : "கிடைக்கும் அளவு"} *</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "english" ? "Description" : "விளக்கம்"}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={language === "english" ? "Enter product description" : "தயாரிப்பு விளக்கத்தை உள்ளிடவும்"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="harvestDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "english" ? "Harvest Date" : "அறுவடை தேதி"}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>{language === "english" ? "Product Image" : "தயாரிப்பு படம்"}</FormLabel>
              <div className="flex items-center gap-4">
                <div className={`border-2 border-dashed rounded-lg p-4 ${imagePreview ? 'border-gray-300' : 'border-gray-400'} flex flex-col items-center justify-center w-full h-40`}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        {language === "english" ? "Click to upload an image" : "படத்தைப் பதிவேற்ற கிளிக் செய்யவும்"}
                      </p>
                    </div>
                  )}
                  <Input 
                    id="image" 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <label htmlFor="image" className="cursor-pointer">
                  <Button type="button" variant="outline">
                    <PlusCircle size={16} className="mr-2" />
                    {language === "english" ? "Select Image" : "படத்தைத் தேர்ந்தெடுக்கவும்"}
                  </Button>
                </label>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-vivasayi-green hover:bg-vivasayi-teal"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full" />
                  {language === "english" ? "Adding..." : "சேர்க்கிறது..."}
                </div>
              ) : (
                language === "english" ? "Add Product" : "தயாரிப்பைச் சேர்க்கவும்"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
