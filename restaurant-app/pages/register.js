import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState(null);
  const router = useRouter();

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="container">
      <h1>Đăng ký tài khoản</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Họ và tên" value={form.name} onChange={update} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={update} required />
        <input name="phone" placeholder="Số điện thoại (không bắt buộc)" value={form.phone} onChange={update} />
        <input name="password" type="password" placeholder="Mật khẩu (tối thiểu 6 ký tự)" value={form.password} onChange={update} required />
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit">Đăng ký</button>
      </form>
    </div>
  );
}
