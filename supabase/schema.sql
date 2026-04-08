
-- This SQL can be run in the Supabase SQL Editor

-- Users table (Extended profiles beyond Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'consumer')),
  phone TEXT,
  address TEXT,
  location TEXT,
  is_verified BOOLEAN DEFAULT false,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Access policies for users
CREATE POLICY "Users can view their own data" 
  ON users FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own data" 
  ON users FOR UPDATE USING (auth.uid() = id);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  name_in_tamil TEXT,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  harvest_date DATE,
  image_url TEXT,
  rating DECIMAL(3, 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Access policies for products
CREATE POLICY "Products are viewable by everyone" 
  ON products FOR SELECT USING (true);
  
CREATE POLICY "Products can be inserted by the farmer" 
  ON products FOR INSERT WITH CHECK (auth.uid() = farmer_id);
  
CREATE POLICY "Products can be updated by the farmer" 
  ON products FOR UPDATE USING (auth.uid() = farmer_id);
  
CREATE POLICY "Products can be deleted by the farmer" 
  ON products FOR DELETE USING (auth.uid() = farmer_id);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES users(id),
  order_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'online')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'completed')),
  delivery_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Access policies for orders
CREATE POLICY "Orders can be viewed by the customer" 
  ON orders FOR SELECT USING (auth.uid() = customer_id);
  
CREATE POLICY "Orders can be inserted by the customer" 
  ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
  
CREATE POLICY "Orders can be updated by the customer" 
  ON orders FOR UPDATE USING (auth.uid() = customer_id);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Access policies for order_items
CREATE POLICY "Order items can be viewed by the customer" 
  ON order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_id = auth.uid()
    )
  );
  
CREATE POLICY "Order items can be viewed by the farmer" 
  ON order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = order_items.product_id 
      AND products.farmer_id = auth.uid()
    )
  );
  
CREATE POLICY "Order items can be inserted by the customer" 
  ON order_items FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

-- Function to get orders for farmers
CREATE OR REPLACE FUNCTION get_farmer_orders(farmer_id UUID)
RETURNS TABLE (
  order_id UUID,
  order_date TIMESTAMP WITH TIME ZONE,
  customer_name TEXT,
  product_name TEXT,
  quantity INTEGER,
  price DECIMAL,
  total_amount DECIMAL,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id AS order_id,
    o.order_date,
    u.name AS customer_name,
    oi.product_name,
    oi.quantity,
    oi.price,
    o.total_amount,
    o.status
  FROM order_items oi
  JOIN orders o ON oi.order_id = o.id
  JOIN users u ON o.customer_id = u.id
  JOIN products p ON oi.product_id = p.id
  WHERE p.farmer_id = get_farmer_orders.farmer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create bucket for product images
-- Note: This needs to be done through the Supabase UI or API
-- INSERT INTO storage.buckets (id, name) VALUES ('product-images', 'Product Images');
-- UPDATE storage.buckets SET public = TRUE WHERE id = 'product-images';
