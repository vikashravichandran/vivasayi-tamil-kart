import { Product, User, Order } from "./types";

export const mockUsers: User[] = [
  {
    id: "f1",
    email: "farmer@example.com",
    name: "Ramu Velan",
    role: "farmer",
    phone: "9876543210",
    address: "123, Perur Main Road, Coimbatore",
    location: "Coimbatore",
    isVerified: true,
    profileImage: "/assets/placeholder.svg"
  },
  {
    id: "c1",
    email: "consumer@example.com",
    name: "Priya Kumar",
    role: "consumer",
    phone: "9876543211",
    address: "456, Anna Nagar, Chennai",
    location: "Chennai",
    profileImage: "/assets/placeholder.svg"
  }
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    farmerId: "f1",
    farmerName: "Ramu Velan",
    name: "Organic Tomatoes",
    nameInTamil: "இயற்கை தக்காளி",
    description: "Fresh organic tomatoes harvested this week",
    category: "vegetables",
    price: 50,
    quantity: 100,
    unit: "kg",
    harvestDate: "2025-05-05",
    imageUrl: "/assets/placeholder.svg",
    rating: 4.5,
    location: "Coimbatore"
  },
  {
    id: "p2",
    farmerId: "f1",
    farmerName: "Ramu Velan",
    name: "Fresh Rice",
    nameInTamil: "புதிய அரிசி",
    description: "Organic rice from traditional farming",
    category: "grains",
    price: 80,
    quantity: 50,
    unit: "kg",
    harvestDate: "2025-05-03",
    imageUrl: "/assets/placeholder.svg",
    rating: 4.8,
    location: "Coimbatore"
  },
  {
    id: "p3",
    farmerId: "f1",
    farmerName: "Ramu Velan",
    name: "Green Bananas",
    nameInTamil: "பச்சை வாழைப்பழம்",
    description: "Fresh green bananas",
    category: "fruits",
    price: 40,
    quantity: 200,
    unit: "dozen",
    harvestDate: "2025-05-06",
    imageUrl: "/assets/placeholder.svg",
    rating: 4.3,
    location: "Coimbatore"
  },
  {
    id: "p4",
    farmerId: "f1",
    farmerName: "Ramu Velan",
    name: "Fresh Coconut",
    nameInTamil: "புதிய தேங்காய்",
    description: "Organic coconuts for drinking and cooking",
    category: "fruits",
    price: 35,
    quantity: 150,
    unit: "piece",
    harvestDate: "2025-05-07",
    imageUrl: "/assets/placeholder.svg",
    rating: 4.7,
    location: "Coimbatore"
  },
  {
    id: "p5",
    farmerId: "f1",
    farmerName: "Ramu Velan",
    name: "Fresh Spinach",
    nameInTamil: "புதிய கீரை",
    description: "Organic spinach leaves",
    category: "vegetables",
    price: 30,
    quantity: 80,
    unit: "bundle",
    harvestDate: "2025-05-08",
    imageUrl: "/assets/placeholder.svg",
    rating: 4.6,
    location: "Coimbatore"
  },
  {
    id: "p6",
    farmerId: "f1",
    farmerName: "Ramu Velan",
    name: "Organic Carrots",
    nameInTamil: "இயற்கை கேரட்",
    description: "Fresh organic carrots",
    category: "vegetables",
    price: 45,
    quantity: 120,
    unit: "kg",
    harvestDate: "2025-05-06",
    imageUrl: "/assets/placeholder.svg",
    rating: 4.4,
    location: "Coimbatore"
  },
  {
    id: "p7",
    farmerId: "f1",
    farmerName: "Ramu Velan",
    name: "Farm Fresh Eggs",
    nameInTamil: "பண்ணை புதிய முட்டைகள்",
    description: "Free-range chicken eggs",
    category: "dairy",
    price: 90,
    quantity: 500,
    unit: "dozen",
    harvestDate: "2025-05-08",
    imageUrl: "/assets/placeholder.svg",
    rating: 4.9,
    location: "Coimbatore"
  },
  {
    id: "p8",
    farmerId: "f1",
    farmerName: "Ramu Velan",
    name: "Organic Potatoes",
    nameInTamil: "இயற்���ை உருளைக்கிழங்கு",
    description: "Fresh organic potatoes",
    category: "vegetables",
    price: 40,
    quantity: 200,
    unit: "kg",
    harvestDate: "2025-05-04",
    imageUrl: "/assets/placeholder.svg",
    rating: 4.2,
    location: "Coimbatore"
  }
];

export const mockOrders: Order[] = [
  {
    id: "o1",
    customerId: "c1",
    orderDate: "2025-05-02",
    items: [
      {
        productId: "p1",
        productName: "Organic Tomatoes",
        quantity: 5,
        price: 50
      },
      {
        productId: "p2",
        productName: "Fresh Rice",
        quantity: 2,
        price: 80
      }
    ],
    totalAmount: 410,
    status: "delivered",
    paymentMethod: "cod",
    paymentStatus: "completed",
    deliveryAddress: "456, Anna Nagar, Chennai"
  },
  {
    id: "o2",
    customerId: "c1",
    orderDate: "2025-05-07",
    items: [
      {
        productId: "p3",
        productName: "Green Bananas",
        quantity: 2,
        price: 40
      },
      {
        productId: "p4",
        productName: "Fresh Coconut",
        quantity: 3,
        price: 35
      }
    ],
    totalAmount: 185,
    status: "shipped",
    paymentMethod: "cod",
    paymentStatus: "pending",
    deliveryAddress: "456, Anna Nagar, Chennai"
  }
];

// Tamil Voice Commands Dictionary
export const tamilVoiceCommands = {
  search: {
    "தக்காளி காண்பி": "search tomato",
    "அரிசி காண்பி": "search rice",
    "வாழைப்பழம் காண்பி": "search banana",
    "தேங்காய் காண்பி": "search coconut",
    "உருளைக்கிழங்கு காண்பி": "search potato",
    "காய்கறிகள் காண்பி": "search vegetables",
    "பழங்கள் காண்பி": "search fruits",
    "மளிகை காண்பி": "search groceries",
    "தானியங்கள் காண்பி": "search grains"
  },
  navigation: {
    "முகப்புக்குச் செல்": "go to home",
    "பொருட்களைக் காட்டு": "go to products",
    "கூடைக்குச் செல்": "go to cart",
    "கார்ட்���ை திற": "open cart",
    "விவசாயி பக்கம் செல்": "go to farmer dashboard",
    "நுகர்வோர் பக்கம் செல்": "go to consumer dashboard",
    "புதிய பொருள் சேர்": "add new product",
    "சேர் பொருள்": "add product",
    "உள்நுழைய": "go to login",
    "பதிவு செய்ய": "go to register"
  },
  checkout: {
    "வாங்கு": "checkout",
    "கொள்முதல் செய்": "place order",
    "கூடையை காலி செய்": "clear cart"
  },
  products: {
    "பொருளைச் சேர்": "add product",
    "புதிய பொருள்": "new product",
    "விலை அமை": "set price",
    "அளவு அமை": "set quantity",
    "பெயர் அமை": "set name",
    "விளக்கம் சேர்": "add description",
    "படம் சேர்": "add image",
    "விவரங்களை சமர்ப்பி": "submit form",
    "வகை அமை": "set category",
    "அறுவடை தேதி அமை": "set harvest date"
  },
  orders: {
    "ஆர்டர்களைக் காட்டு": "show orders",
    "ஆர்டரை ஏற்றுக்கொள்": "accept order",
    "ஆர்டரை நிராகரி": "reject order",
    "ஆர்டர் நிலையைக் காட்டு": "show order status"
  }
};
