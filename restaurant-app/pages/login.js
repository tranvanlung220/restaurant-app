import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const router = useRouter();

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/login", {
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
      <h1>Đăng nhập</h1>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={update} required />
        <input name="password" type="password" placeholder="Mật khẩu" value={form.password} onChange={update} required />
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}
