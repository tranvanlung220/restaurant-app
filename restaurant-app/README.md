# Website Quản Lý Nhà Hàng — Hướng dẫn sử dụng

Dự án dùng **Next.js** (gộp chung backend API + frontend trong 1 project), **Neon Postgres**
để lưu dữ liệu, đẩy code lên **GitHub**, và deploy trên **Vercel**.

## Cấu trúc chức năng đã có

- Đăng ký / đăng nhập / đăng xuất (mật khẩu được mã hoá bằng bcrypt, phiên đăng nhập dùng JWT lưu trong cookie httpOnly)
- Trang chủ, thực đơn, đặt bàn, liên hệ (frontend đơn giản, không cần thư viện ngoài)
- Trang quản trị (`/admin`) dành cho tài khoản có role = admin:
  - Thêm / xoá món ăn trong thực đơn
  - Xem danh sách đặt bàn, xác nhận / huỷ đặt bàn

## 1. Cài đặt và chạy thử trên máy (VS Code)

1. Mở thư mục `restaurant-app` bằng VS Code.
2. Mở terminal, chạy:
   ```
   npm install
   ```
3. Copy file `.env.example` thành `.env.local`, rồi điền `DATABASE_URL` (lấy ở bước 2 bên dưới) và `JWT_SECRET` (gõ đại một chuỗi dài, ngẫu nhiên).
4. Chạy thử:
   ```
   npm run dev
   ```
   Mở trình duyệt vào `http://localhost:3000`.

## 2. Tạo database miễn phí trên Neon

1. Vào https://neon.tech, đăng ký tài khoản (có thể dùng GitHub để đăng nhập nhanh).
2. Bấm **New Project**, đặt tên tuỳ ý (VD: `restaurant-db`), chọn region gần bạn, bấm **Create**.
3. Vào project vừa tạo → mục **Connection string** (hoặc **Dashboard**), copy chuỗi dạng:
   ```
   postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require
   ```
   Đây chính là `DATABASE_URL`.
4. Vào tab **SQL Editor** trong Neon, mở file `schema.sql` trong project (đã có sẵn), copy toàn bộ nội dung, dán vào SQL Editor và bấm **Run**. Việc này tạo các bảng `users`, `menu_items`, `reservations`, `contact_messages` và thêm sẵn vài món ăn mẫu.
5. Để tạo tài khoản admin: trước tiên vào website, bấm **Đăng ký** tạo 1 tài khoản bình thường. Sau đó quay lại **SQL Editor** của Neon, chạy lệnh (đổi email cho đúng email bạn vừa đăng ký):
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'email-cua-ban@gmail.com';
   ```
   Đăng nhập lại để có quyền admin, vào `/admin` để quản lý.

## 3. Đưa code lên GitHub

1. Vào https://github.com, đăng nhập, bấm **New repository**, đặt tên (VD: `restaurant-app`), để **Public** hoặc **Private** tuỳ bạn, KHÔNG tick "Add README" (vì mình đã có sẵn). Bấm **Create repository**.
2. Trong VS Code, mở terminal tại thư mục `restaurant-app`, chạy lần lượt:
   ```
   git init
   git add .
   git commit -m "Khoi tao du an nha hang"
   git branch -M main
   git remote add origin https://github.com/TEN-BAN/restaurant-app.git
   git push -u origin main
   ```
   (thay `TEN-BAN` bằng username GitHub của bạn, và đúng tên repo bạn vừa tạo)
3. File `.env.local` sẽ KHÔNG bị đẩy lên GitHub (đã có trong `.gitignore`) — đây là điều nên làm để không lộ mật khẩu database.

## 4. Deploy lên Vercel

1. Vào https://vercel.com, đăng nhập bằng tài khoản GitHub.
2. Bấm **Add New... → Project**, chọn repo `restaurant-app` vừa đẩy lên, bấm **Import**.
3. Ở bước cấu hình, mở phần **Environment Variables**, thêm 2 biến:
   - `DATABASE_URL` = chuỗi kết nối Neon (giống trong `.env.local`)
   - `JWT_SECRET` = chuỗi bí mật bạn đã chọn
4. Bấm **Deploy**. Đợi khoảng 1–2 phút, Vercel sẽ cấp cho bạn 1 link dạng `https://restaurant-app-xxxx.vercel.app`.
5. Mỗi lần bạn `git push` code mới lên GitHub, Vercel sẽ tự động build và deploy lại — không cần làm lại các bước trên.

## 5. Một số điều nên biết

- Muốn đổi tên nhà hàng, địa chỉ, ảnh nền: sửa trực tiếp trong `pages/index.js`, `pages/contact.js`, `components/Navbar.js`, `components/Footer.js`.
- Muốn thêm chức năng mới (VD: giỏ hàng, thanh toán online, đánh giá món ăn...), có thể tạo thêm bảng trong `schema.sql` và file API tương ứng trong `pages/api/`.
- Nếu deploy xong mà trang báo lỗi 500 khi gọi API: kiểm tra lại `DATABASE_URL` đã điền đúng trong Vercel → Project Settings → Environment Variables chưa, và đã chạy `schema.sql` trên Neon chưa.
