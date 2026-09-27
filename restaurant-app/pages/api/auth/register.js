import bcrypt from "bcryptjs";
import pool from "../../../lib/db";
import { signToken, setAuthCookie } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password, phone } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email này đã được đăng ký" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, role)
       VALUES ($1, $2, $3, $4, 'customer')
       RETURNING id, name, email, role`,
      [name, email, passwordHash, phone || null]
    );

    const user = result.rows[0];
    const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role });
    setAuthCookie(res, token);

    return res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi server, vui lòng thử lại" });
  }
}
