-- Chạy toàn bộ file này trong Neon SQL Editor để tạo cấu trúc database

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(20) NOT NULL DEFAULT 'customer', -- 'customer' hoặc 'admin'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(12,0) NOT NULL,
  category VARCHAR(100) DEFAULT 'Khác',
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  note TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, confirmed, cancelled
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dữ liệu mẫu cho menu để test giao diện
INSERT INTO menu_items (name, description, price, category)
VALUES
  ('Phở bò tái', 'Phở bò truyền thống, nước dùng ninh xương 8 tiếng', 55000, 'Món chính'),
  ('Gỏi cuốn tôm thịt', 'Cuốn tươi ăn kèm nước chấm đặc biệt', 40000, 'Khai vị'),
  ('Cơm rang thập cẩm', 'Cơm rang trứng, tôm, xúc xích, rau củ', 60000, 'Món chính'),
  ('Trà đào cam sả', 'Giải khát mát lạnh', 35000, 'Đồ uống')
ON CONFLICT DO NOTHING;
