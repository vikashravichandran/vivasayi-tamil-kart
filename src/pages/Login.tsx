
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { login, language, isLoggedIn } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      } else {
        setLoginError(language === "english" ? "Login failed. Please check your credentials." : "உள்நுழைவு தோல்வியுற்றது. உங்கள் சான்றுகளைச் சரிபார்க்கவும்.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {language === "english" ? "Welcome Back" : "மீண்டும் வரவேற்கிறோம்"}
          </CardTitle>
          <CardDescription className="text-center">
            {language === "english" 
              ? "Enter your credentials to access your account" 
              : "உங்கள் கணக்கை அணுக உங்கள் சான்றுகளை உள்ளிடவும்"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {loginError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {language === "english" ? "Login Failed" : "உள்நுழைவு தோல்வியுற்றது"}
                </AlertTitle>
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">
                {language === "english" ? "Email" : "மின்னஞ்சல்"}
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password">
                  {language === "english" ? "Password" : "கடவுச்சொல்"}
                </Label>
                <Link to="/forgot-password" className="text-sm text-vivasayi-green hover:underline">
                  {language === "english" ? "Forgot Password?" : "கடவுச்சொல் மறந்துவிட்டதா?"}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder={language === "english" ? "Enter your password" : "உங்கள் கடவுச்சொல்லை உள்ளிடவும்"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full bg-vivasayi-green hover:bg-vivasayi-teal" 
              disabled={isLoading}
            >
              {isLoading 
                ? (language === "english" ? "Logging in..." : "உள்நுழைகிறது...") 
                : (language === "english" ? "Login" : "உள்நுழைய")}
            </Button>
            <p className="mt-4 text-center text-sm">
              {language === "english" ? "Don't have an account?" : "கணக்கு இல்லையா?"}{" "}
              <Link to="/register" className="text-vivasayi-green hover:underline">
                {language === "english" ? "Register" : "பதிவு செய்ய"}
              </Link>
            </p>
            
            {/* Demo login help text */}
            <div className="mt-6 p-3 bg-gray-100 rounded-md text-sm text-gray-600">
              <p className="font-semibold mb-1">
                {language === "english" ? "Demo Accounts:" : "டெமோ கணக்குகள்:"}
              </p>
              <p><strong>{language === "english" ? "Farmer:" : "விவசாயி:"}</strong> farmer@example.com / password</p>
              <p><strong>{language === "english" ? "Consumer:" : "நுகர்வோர்:"}</strong> consumer@example.com / password</p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
