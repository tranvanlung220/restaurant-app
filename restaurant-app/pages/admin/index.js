import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminHome() {
  const [user, setUser] = useState(undefined);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        if (!data.user || data.user.role !== "admin") {
          router.push("/login");
        }
      });
  }, []);

  if (user === undefined) return <div className="container">Đang kiểm tra quyền truy cập...</div>;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="container">
      <h1>Trang quản trị</h1>
      <p>Xin chào, {user.name} (admin)</p>
      <div className="grid">
        <div className="card">
          <h3>Quản lý thực đơn</h3>
          <p>Thêm, sửa, xoá các món ăn trên website</p>
          <Link href="/admin/menu"><button className="btn">Đi tới</button></Link>
        </div>
        <div className="card">
          <h3>Quản lý đặt bàn</h3>
          <p>Xem và xác nhận các lượt đặt bàn của khách</p>
          <Link href="/admin/reservations"><button className="btn">Đi tới</button></Link>
        </div>
      </div>
    </div>
  );
}
