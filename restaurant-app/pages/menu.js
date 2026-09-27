import { useEffect, useState } from "react";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      });
  }, []);

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="container">
      <h1>Thực đơn</h1>
      {loading && <p>Đang tải...</p>}
      {categories.map((cat) => (
        <div key={cat}>
          <h2>{cat}</h2>
          <div className="grid">
            {items
              .filter((i) => i.category === cat)
              .map((item) => (
                <div className="card menu-item" key={item.id}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p className="price">{Number(item.price).toLocaleString("vi-VN")} đ</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
