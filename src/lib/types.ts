
export interface User {
  id: string;
  email: string;
  name: string;
  role: "farmer" | "consumer";
  phone: string;
  address?: string;
  location?: string;
  isVerified?: boolean;
  profileImage?: string;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  nameInTamil?: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  harvestDate?: string;
  imageUrl: string;
  rating?: number;
  location?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  orderDate: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "cod" | "online";
  paymentStatus: "pending" | "completed";
  deliveryAddress: string;
}
