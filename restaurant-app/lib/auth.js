import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-dev-only";
const COOKIE_NAME = "token";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Đặt cookie httpOnly chứa token sau khi đăng nhập/đăng ký thành công
export function setAuthCookie(res, token) {
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
  });
  res.setHeader("Set-Cookie", cookie);
}

// Xoá cookie khi đăng xuất
export function clearAuthCookie(res) {
  const cookie = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  res.setHeader("Set-Cookie", cookie);
}

// Đọc user hiện tại từ cookie trong request (dùng trong các API cần đăng nhập)
export function getUserFromReq(req) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return verifyToken(token);
}

// Chặn nếu không phải admin, trả về true nếu đã chặn (đã gửi response lỗi)
export function requireAdmin(req, res) {
  const user = getUserFromReq(req);
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Bạn không có quyền truy cập chức năng này" });
    return null;
  }
  return user;
}
