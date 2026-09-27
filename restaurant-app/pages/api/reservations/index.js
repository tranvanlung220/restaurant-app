import pool from "../../../lib/db";
import { getUserFromReq, requireAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { full_name, phone, email, reservation_date, reservation_time, guests, note } =
      req.body || {};

    if (!full_name || !phone || !reservation_date || !reservation_time) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin đặt bàn" });
    }

    const currentUser = getUserFromReq(req); // có thể null nếu khách chưa đăng nhập

    try {
      const result = await pool.query(
        `INSERT INTO reservations
          (user_id, full_name, phone, email, reservation_date, reservation_time, guests, note)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING *`,
        [
          currentUser ? currentUser.id : null,
          full_name,
          phone,
          email || null,
          reservation_date,
          reservation_time,
          guests || 1,
          note || null,
        ]
      );
      return res.status(201).json({ reservation: result.rows[0] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  if (req.method === "GET") {
    // Chỉ admin mới được xem toàn bộ danh sách đặt bàn
    const admin = requireAdmin(req, res);
    if (!admin) return;

    try {
      const result = await pool.query(
        "SELECT * FROM reservations ORDER BY reservation_date DESC, reservation_time DESC"
      );
      return res.status(200).json({ reservations: result.rows });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
