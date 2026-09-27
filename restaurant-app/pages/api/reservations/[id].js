import pool from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
  const { id } = req.query;
  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (req.method === "PUT") {
    const { status } = req.body || {};
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }
    try {
      const result = await pool.query(
        "UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *",
        [status, id]
      );
      return res.status(200).json({ reservation: result.rows[0] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await pool.query("DELETE FROM reservations WHERE id = $1", [id]);
      return res.status(200).json({ message: "Đã xoá" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
