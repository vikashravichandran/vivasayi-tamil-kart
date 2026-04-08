
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, CartItem, Product } from "@/lib/types";
import { mockUsers, mockProducts } from "@/lib/mockData";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AppContextType {
  currentUser: User | null;
  cart: CartItem[];
  isLoggedIn: boolean;
  products: Product[];
  language: "english" | "tamil";
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleLanguage: () => void;
  getCartTotal: () => number;
  registerUser: (userData: Partial<User>, password: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]); 
  const [language, setLanguage] = useState<"english" | "tamil">("english");

  const initializeApp = async () => {
    // Check if user is already logged in
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch additional user data from the users table
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (!error && userData) {
          const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: userData.name || '',
            role: userData.role as "farmer" | "consumer",
            phone: userData.phone || '',
            address: userData.address || '',
            location: userData.location || '',
            isVerified: userData.is_verified || false,
            profileImage: userData.profile_image || ''
          };
          
          setCurrentUser(user);
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    }

    // Load cart from localStorage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    
    // Load language preference
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage && (storedLanguage === "english" || storedLanguage === "tamil")) {
      setLanguage(storedLanguage as "english" | "tamil");
    }
    
    // Load real products from Supabase
    await refreshProducts();
  };

  useEffect(() => {
    initializeApp();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Fetch user profile after sign in
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (!error && userData) {
            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: userData.name || '',
              role: userData.role as "farmer" | "consumer",
              phone: userData.phone || '',
              address: userData.address || '',
              location: userData.location || '',
              isVerified: userData.is_verified || false,
              profileImage: userData.profile_image || ''
            };
            
            setCurrentUser(user);
            setIsLoggedIn(true);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Save cart to localStorage when it changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const refreshProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          users:farmer_id (name, location)
        `);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Format data to match Product type
        const formattedData = data.map((item: any) => ({
          id: item.id,
          farmerId: item.farmer_id,
          farmerName: item.users?.name || 'Unknown Farmer',
          name: item.name,
          nameInTamil: item.name_in_tamil,
          description: item.description,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
          harvestDate: item.harvest_date,
          imageUrl: item.image_url,
          rating: item.rating,
          location: item.users?.location
        }));
        
        setProducts(formattedData);
      }
    } catch (error) {
      console.error("Error refreshing products:", error);
      // Fall back to mock data if real data fetch fails
      setProducts(mockProducts);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Auth successful, now fetch user profile data
      if (data.user) {
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle(); // Change from single() to maybeSingle() to handle case where no profile exists
            
          if (userError) throw userError;
          
          if (userData) {
            const user: User = {
              id: data.user.id,
              email: data.user.email || '',
              name: userData.name || '',
              role: userData.role as "farmer" | "consumer",
              phone: userData.phone || '',
              address: userData.address || '',
              location: userData.location || '',
              isVerified: userData.is_verified || false,
              profileImage: userData.profile_image || ''
            };
            
            setCurrentUser(user);
            setIsLoggedIn(true);
            
            toast({
              title: "Login Successful",
              description: `Welcome back, ${userData.name || 'User'}!`,
            });
            
            return true;
          } else {
            // Profile doesn't exist, create one
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                email: data.user.email || '',
                name: 'User',
                role: 'consumer'
              });
              
            if (insertError) throw insertError;
            
            const user: User = {
              id: data.user.id,
              email: data.user.email || '',
              name: 'User',
              role: 'consumer',
              phone: '',
              address: '',
              location: '',
              isVerified: false,
              profileImage: ''
            };
            
            setCurrentUser(user);
            setIsLoggedIn(true);
            
            toast({
              title: "Login Successful",
              description: `Welcome to VivasayiKart!`,
            });
            
            return true;
          }
        } catch (profileError: any) {
          console.error("Error fetching user profile:", profileError);
          toast({
            title: "Login Error",
            description: "Could not retrieve your profile data. Please try again.",
            variant: "destructive",
          });
          return false;
        }
      }
      
      return false;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      return false;
    }
  };

  const registerUser = async (userData: Partial<User>, password: string) => {
    try {
      const result = await supabase.auth.signUp({
        email: userData.email || "",
        password,
        options: {
          data: {
            name: userData.name || "",
            phone: userData.phone || "",
            address: userData.address || "",
            location: userData.location || "",
            is_verified: false,
            profile_image: ""
          }
        }
      });
      
      if (result.error) {
        toast({
          title: "Registration Failed",
          description: result.error.message,
          variant: "destructive",
        });
        return false;
      } else {
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully",
        });
        return true;
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} added to your cart`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    
    toast({
      title: "Removed from Cart",
      description: "Item removed from your cart",
    });
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const toggleLanguage = () => {
    const newLanguage = language === "english" ? "tamil" : "english";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      cart,
      isLoggedIn,
      products,
      language,
      login,
      logout,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      toggleLanguage,
      getCartTotal,
      registerUser,
      refreshProducts,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
