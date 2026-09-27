import pool from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await pool.query(
        "SELECT * FROM menu_items ORDER BY category, id"
      );
      return res.status(200).json({ items: result.rows });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  if (req.method === "POST") {
    const admin = requireAdmin(req, res);
    if (!admin) return; // requireAdmin đã trả lỗi 403

    const { name, description, price, category, image_url, available } = req.body || {};
    if (!name || !price) {
      return res.status(400).json({ message: "Vui lòng nhập tên món và giá" });
    }

    try {
      const result = await pool.query(
        `INSERT INTO menu_items (name, description, price, category, image_url, available)
         VALUES ($1, $2, $3, $4, $5, COALESCE($6, TRUE))
         RETURNING *`,
        [name, description || null, price, category || "Khác", image_url || null, available]
      );
      return res.status(201).json({ item: result.rows[0] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
