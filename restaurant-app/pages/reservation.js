import { useState } from "react";

export default function Reservation() {
  const [form, setForm] = useState({
    full_name: "", phone: "", email: "", reservation_date: "",
    reservation_time: "", guests: 2, note: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
    } else {
      setMessage("Đặt bàn thành công! Nhà hàng sẽ liên hệ xác nhận với bạn sớm nhất.");
      setForm({ full_name: "", phone: "", email: "", reservation_date: "", reservation_time: "", guests: 2, note: "" });
    }
  }

  return (
    <div className="container">
      <h1>Đặt bàn</h1>
      <form onSubmit={handleSubmit}>
        <input name="full_name" placeholder="Họ và tên" value={form.full_name} onChange={update} required />
        <input name="phone" placeholder="Số điện thoại" value={form.phone} onChange={update} required />
        <input name="email" type="email" placeholder="Email (không bắt buộc)" value={form.email} onChange={update} />
        <input name="reservation_date" type="date" value={form.reservation_date} onChange={update} required />
        <input name="reservation_time" type="time" value={form.reservation_time} onChange={update} required />
        <input name="guests" type="number" min="1" placeholder="Số khách" value={form.guests} onChange={update} required />
        <textarea name="note" placeholder="Ghi chú thêm (không bắt buộc)" value={form.note} onChange={update} />
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <button className="btn" type="submit">Xác nhận đặt bàn</button>
      </form>
    </div>
  );
}
