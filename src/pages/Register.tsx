
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useApp } from "@/contexts/AppContext";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"farmer" | "consumer">("consumer");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const { registerUser, login, language } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError(language === "english" ? "Passwords do not match" : "கடவுச்சொற்கள் பொருந்தவில்லை");
      return;
    }
    
    setPasswordError("");
    setRegistrationError("");
    setIsLoading(true);
    
    try {
      // First, sign up with auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            phone
          }
        }
      });
      
      if (authError) throw authError;
      
      // Only proceed if auth signup was successful
      if (authData.user) {
        // Insert into users table using service role client
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: email,
            name: name,
            role: role,
            phone: phone || ''
          });
          
        if (profileError) {
          console.error("Profile creation error:", profileError);
          setRegistrationError(profileError.message);
          toast({
            title: "Registration Failed",
            description: `Error creating user profile: ${profileError.message}`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // Auto login after registration
        await login(email, password);
        
        toast({
          title: "Registration Successful",
          description: language === "english" 
            ? "Your account has been created successfully" 
            : "உங்கள் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது",
        });
        
        navigate(role === "farmer" ? "/farmer-dashboard" : "/consumer-dashboard");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegistrationError(error.message);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 py-8">
      <Card className="w-full max-w-lg animate-fade-in my-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {language === "english" ? "Create an Account" : "கணக்கை உருவாக்குங்கள்"}
          </CardTitle>
          <CardDescription className="text-center">
            {language === "english" 
              ? "Join VivasayiKart and start buying or selling fresh produce" 
              : "விவசாயி கார்ட்டில் இணைந்து புதிய பொருட்களை வாங்கவோ அல்லது விற்கவோ தொடங்குங்கள்"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {registrationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{registrationError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">
                {language === "english" ? "Full Name" : "முழு பெயர்"}
              </Label>
              <Input
                id="name"
                placeholder={language === "english" ? "Enter your name" : "உங்கள் பெயரை உள்ளிடவும்"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {language === "english" ? "Email Address" : "மின்னஞ்சல் முகவரி"}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={language === "english" ? "Enter your email" : "உங்கள் மின்னஞ்சலை உள்ளிடவும்"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                {language === "english" ? "Phone Number" : "தொலைபேசி எண்"}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={language === "english" ? "Enter your phone number" : "உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்"}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {language === "english" ? "Password" : "கடவுச்சொல்"}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={language === "english" ? "Create a password" : "ஒரு கடவுச்சொல்லை உருவாக்கவும்"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {language === "english" ? "Confirm Password" : "கடவுச்சொல்லை உறுதிப்படுத்தவும்"}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={language === "english" ? "Confirm your password" : "உங்கள் கடவுச்சொல்லை உறுதிப்படுத்தவும்"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            <div className="space-y-2">
              <Label>
                {language === "english" ? "I want to register as" : "நான் இதற்காக பதிவு செய்ய விரும்புகிறேன்"}
              </Label>
              <RadioGroup 
                value={role} 
                onValueChange={(val) => setRole(val as "farmer" | "consumer")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="farmer" id="farmer" />
                  <Label htmlFor="farmer" className="cursor-pointer">
                    {language === "english" ? "Farmer" : "விவசாயி"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="consumer" id="consumer" />
                  <Label htmlFor="consumer" className="cursor-pointer">
                    {language === "english" ? "Consumer" : "நுகர்வோர்"}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full bg-vivasayi-green hover:bg-vivasayi-teal" 
              disabled={isLoading}
            >
              {isLoading 
                ? (language === "english" ? "Creating Account..." : "கணக்கை உருவாக்குகிறது...") 
                : (language === "english" ? "Create Account" : "கணக்கை உருவாக்கு")}
            </Button>
            <p className="mt-4 text-center text-sm">
              {language === "english" ? "Already have an account?" : "ஏற்கனவே கணக்கு உள்ளதா?"}{" "}
              <Link to="/login" className="text-vivasayi-green hover:underline">
                {language === "english" ? "Login" : "உள்நுழைய"}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
