import { useEffect, useState } from "react";

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", image_url: "" });
  const [error, setError] = useState(null);

  function load() {
    fetch("/api/menu").then((r) => r.json()).then((data) => setItems(data.items || []));
  }

  useEffect(() => { load(); }, []);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
    } else {
      setForm({ name: "", description: "", price: "", category: "", image_url: "" });
      load();
    }
  }

  async function handleDelete(id) {
    if (!confirm("Xoá món ăn này?")) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="container">
      <h1>Quản lý thực đơn</h1>

      <div className="card">
        <h3>Thêm món mới</h3>
        <form onSubmit={handleAdd}>
          <input name="name" placeholder="Tên món" value={form.name} onChange={update} required />
          <input name="category" placeholder="Danh mục (VD: Món chính)" value={form.category} onChange={update} />
          <input name="price" type="number" placeholder="Giá (đ)" value={form.price} onChange={update} required />
          <textarea name="description" placeholder="Mô tả" value={form.description} onChange={update} />
          <input name="image_url" placeholder="Link ảnh (không bắt buộc)" value={form.image_url} onChange={update} />
          {error && <p className="error">{error}</p>}
          <button className="btn" type="submit">Thêm món</button>
        </form>
      </div>

      <h3>Danh sách món ăn</h3>
      <table>
        <thead>
          <tr><th>Tên</th><th>Danh mục</th><th>Giá</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{Number(item.price).toLocaleString("vi-VN")} đ</td>
              <td><button onClick={() => handleDelete(item.id)} className="btn secondary">Xoá</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
