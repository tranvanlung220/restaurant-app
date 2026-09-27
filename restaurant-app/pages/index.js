import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="hero">
        <h1>Nhà Hàng Sen Vàng</h1>
        <p>Ẩm thực Việt truyền thống trong không gian ấm cúng</p>
        <Link href="/reservation">
          <button className="btn">Đặt bàn ngay</button>
        </Link>
      </div>

      <div className="container">
        <h2>Về chúng tôi</h2>
        <p>
          Nhà Hàng Sen Vàng phục vụ các món ăn Việt Nam truyền thống được chế biến từ
          nguyên liệu tươi ngon, mang đến trải nghiệm ẩm thực trọn vẹn cho gia đình và bạn bè.
        </p>

        <h2>Giờ mở cửa</h2>
        <p>Tất cả các ngày trong tuần: 10:00 — 22:00</p>

        <Link href="/menu"><button className="btn secondary">Xem thực đơn</button></Link>
      </div>
    </div>
  );
}
