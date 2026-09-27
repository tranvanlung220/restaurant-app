import pool from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    const { name, description, price, category, image_url, available } = req.body || {};
    try {
      const result = await pool.query(
        `UPDATE menu_items
         SET name = $1, description = $2, price = $3, category = $4, image_url = $5, available = $6
         WHERE id = $7
         RETURNING *`,
        [name, description, price, category, image_url, available, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy món ăn" });
      }
      return res.status(200).json({ item: result.rows[0] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  if (req.method === "DELETE") {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    try {
      await pool.query("DELETE FROM menu_items WHERE id = $1", [id]);
      return res.status(200).json({ message: "Đã xoá món ăn" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
