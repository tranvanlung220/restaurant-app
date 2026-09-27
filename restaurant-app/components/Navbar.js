import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, [router.pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  }

  return (
    <div className="navbar">
      <Link href="/" className="brand">🍽 Nhà Hàng Sen Vàng</Link>
      <nav>
        <Link href="/">Trang chủ</Link>
        <Link href="/menu">Thực đơn</Link>
        <Link href="/reservation">Đặt bàn</Link>
        <Link href="/contact">Liên hệ</Link>
        {user && user.role === "admin" && <Link href="/admin">Quản trị</Link>}
        {user ? (
          <>
            <span style={{ marginLeft: 20 }}>Xin chào, {user.name}</span>
            <button
              onClick={handleLogout}
              style={{ marginLeft: 12, background: "none", border: "none", color: "#e8b84b", cursor: "pointer" }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Đăng nhập</Link>
            <Link href="/register">Đăng ký</Link>
          </>
        )}
      </nav>
    </div>
  );
}
