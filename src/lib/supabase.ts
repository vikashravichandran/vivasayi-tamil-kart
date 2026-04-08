import { createClient } from '@supabase/supabase-js';
import { toast } from "@/components/ui/use-toast";
import { Product, User, CartItem, Order } from '@/lib/types';

// Initialize Supabase client
const supabaseUrl = 'https://swsmtmukcqcsqekqazts.supabase.co';
// For security, we should use environment variables for the key, 
// but since this is provided directly in the chat, we'll use it directly
// In a production environment, always use environment variables for sensitive keys
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c210bXVrY3Fjc3Fla3FhenRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTYzNDUsImV4cCI6MjA2MjI5MjM0NX0.0jbf0ZMsHrEiWf5MFfVfXiX2Nw-ISeb3F4SYePEEkM8'; 

// Determine if we should use mock client
const isMockClient = !supabaseUrl || !supabaseAnonKey;

if (isMockClient) {
  console.warn('Using mock Supabase client. For production, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User authentication functions
export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (authError) throw authError;
    
    // After successful signup, add user profile data
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: email,
          name: userData.name,
          role: userData.role,
          phone: userData.phone || '',
          address: userData.address || '',
          location: userData.location || '',
          is_verified: false,
          profile_image: userData.profileImage || ''
        });
        
      if (profileError) throw profileError;
    }
    
    toast({
      title: "Registration Successful",
      description: "Please check your email to verify your account",
    });
    
    return { success: true, user: authData.user };
  } catch (error: any) {
    toast({
      title: "Registration Failed",
      description: error.message,
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Fetch additional user data
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (userError) throw userError;
      
      return { success: true, user: { ...userData, email: data.user.email } };
    }
    
    return { success: true, user: data.user };
  } catch (error: any) {
    toast({
      title: "Login Failed",
      description: error.message,
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast({
      title: "Error signing out",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
  return true;
};

// Product related functions
export const fetchProducts = async () => {
  try {
    if (isMockClient) {
      // Return mock data when using mock client
      console.log("Using mock product data because Supabase credentials are missing");
      const { mockProducts } = await import('@/lib/mockData');
      return mockProducts;
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        farmers:farmer_id (name, location)
      `);
      
    if (error) throw error;
    
    // Format the data to match our Product type
    const formattedData = data.map((item: any) => ({
      id: item.id,
      farmerId: item.farmer_id,
      farmerName: item.farmers?.name || 'Unknown Farmer',
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
      location: item.farmers?.location
    }));
    
    return formattedData;
  } catch (error: any) {
    console.error('Error fetching products:', error);
    toast({
      title: "Error fetching products",
      description: error.message,
      variant: "destructive",
    });
    
    // Fallback to mock data on error
    const { mockProducts } = await import('@/lib/mockData');
    return mockProducts;
  }
};

export const fetchFarmerProducts = async (farmerId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        farmers:farmer_id (name, location)
      `)
      .eq('farmer_id', farmerId);
      
    if (error) throw error;
    
    // Format the data to match our Product type
    const formattedData = data.map((item: any) => ({
      id: item.id,
      farmerId: item.farmer_id,
      farmerName: item.farmers?.name || 'Unknown Farmer',
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
      location: item.farmers?.location
    }));
    
    return formattedData;
  } catch (error: any) {
    console.error('Error fetching farmer products:', error);
    toast({
      title: "Error fetching products",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        farmer_id: product.farmerId,
        name: product.name,
        name_in_tamil: product.nameInTamil,
        description: product.description,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        unit: product.unit,
        harvest_date: product.harvestDate,
        image_url: product.imageUrl,
        rating: product.rating || 0
      })
      .select();
      
    if (error) throw error;
    
    toast({
      title: "Product Added",
      description: "Your product has been added successfully",
    });
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error adding product:', error);
    toast({
      title: "Error adding product",
      description: error.message,
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const updateProduct = async (product: Product) => {
  try {
    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        name_in_tamil: product.nameInTamil,
        description: product.description,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        unit: product.unit,
        harvest_date: product.harvestDate,
        image_url: product.imageUrl
      })
      .eq('id', product.id);
      
    if (error) throw error;
    
    toast({
      title: "Product Updated",
      description: "Your product has been updated successfully",
    });
    
    return true;
  } catch (error: any) {
    console.error('Error updating product:', error);
    toast({
      title: "Error updating product",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
      
    if (error) throw error;
    
    toast({
      title: "Product Deleted",
      description: "Your product has been deleted",
    });
    
    return true;
  } catch (error: any) {
    console.error('Error deleting product:', error);
    toast({
      title: "Error deleting product",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

// Order related functions
export const createOrder = async (order: Omit<Order, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_id: order.customerId,
        order_date: order.orderDate,
        total_amount: order.totalAmount,
        status: order.status,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        delivery_address: order.deliveryAddress
      })
      .select();
      
    if (error) throw error;
    
    // Add order items
    const orderItems = order.items.map(item => ({
      order_id: data[0].id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
      
    if (itemsError) throw itemsError;
    
    toast({
      title: "Order Placed",
      description: "Your order has been placed successfully",
    });
    
    return { success: true, orderId: data[0].id };
  } catch (error: any) {
    console.error('Error creating order:', error);
    toast({
      title: "Error placing order",
      description: error.message,
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const fetchUserOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('customer_id', userId);
      
    if (error) throw error;
    
    // Format the data to match our Order type
    const formattedData = data.map((order: any) => ({
      id: order.id,
      customerId: order.customer_id,
      orderDate: order.order_date,
      items: order.order_items.map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: order.total_amount,
      status: order.status,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      deliveryAddress: order.delivery_address
    }));
    
    return formattedData;
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    toast({
      title: "Error fetching orders",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const fetchFarmerOrders = async (farmerId: string) => {
  try {
    // Get all products for this farmer
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('farmer_id', farmerId);
      
    if (productsError) throw productsError;
    
    if (!products || products.length === 0) {
      return []; // No products, so no orders
    }
    
    const productIds = products.map(p => p.id);
    
    // Get all order items containing these products
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('order_id, product_id, product_name, quantity, price')
      .in('product_id', productIds);
      
    if (itemsError) throw itemsError;
    
    if (!orderItems || orderItems.length === 0) {
      return []; // No order items for these products
    }
    
    // Get the full orders
    const orderIds = Array.from(new Set(orderItems.map(item => item.order_id)));
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        customers:customer_id (name, email, phone)
      `)
      .in('id', orderIds);
      
    if (ordersError) throw ordersError;
    
    // Build complete order objects
    const formattedOrders = orders.map(order => {
      const relevantItems = orderItems.filter(item => item.order_id === order.id);
      
      return {
        id: order.id,
        customerId: order.customer_id,
        customerName: order.customers?.name || 'Unknown Customer',
        customerEmail: order.customers?.email || '',
        customerPhone: order.customers?.phone || '',
        orderDate: order.order_date,
        items: relevantItems.map(item => ({
          productId: item.product_id,
          productName: item.product_name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: order.total_amount,
        status: order.status,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        deliveryAddress: order.delivery_address
      };
    });
    
    return formattedOrders;
  } catch (error: any) {
    console.error('Error fetching farmer orders:', error);
    toast({
      title: "Error fetching orders",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

// Image upload function
export const uploadProductImage = async (file: File, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;
    
    // Get public URL for the uploaded image
    const { data: publicUrl } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);
      
    return { success: true, url: publicUrl.publicUrl };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    toast({
      title: "Error uploading image",
      description: error.message,
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    if (isMockClient) {
      // Return mock user data when using mock client
      console.log("Using mock user data because Supabase credentials are missing");
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    try {
      // Fetch user profile data
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      if (!data) {
        console.error('User profile not found');
        return null;
      }
      
      return {
        id: user.id,
        email: user.email || '',
        name: data.name || '',
        role: data.role || 'consumer',
        phone: data.phone || '',
        address: data.address || '',
        location: data.location || '',
        isVerified: data.is_verified || false,
        profileImage: data.profile_image || ''
      };
    } catch (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }
  } catch (error: any) {
    console.error('Error getting current user:', error);
    return null;
  }
};
