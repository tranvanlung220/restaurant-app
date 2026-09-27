import { useEffect, useState } from "react";

export default function AdminReservations() {
  const [list, setList] = useState([]);

  function load() {
    fetch("/api/reservations").then((r) => r.json()).then((data) => setList(data.reservations || []));
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    await fetch(`/api/reservations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div className="container">
      <h1>Danh sách đặt bàn</h1>
      <table>
        <thead>
          <tr><th>Khách</th><th>SĐT</th><th>Ngày</th><th>Giờ</th><th>Số khách</th><th>Trạng thái</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          {list.map((r) => (
            <tr key={r.id}>
              <td>{r.full_name}</td>
              <td>{r.phone}</td>
              <td>{new Date(r.reservation_date).toLocaleDateString("vi-VN")}</td>
              <td>{r.reservation_time}</td>
              <td>{r.guests}</td>
              <td><span className={`badge ${r.status}`}>{r.status}</span></td>
              <td>
                <button className="btn" onClick={() => updateStatus(r.id, "confirmed")}>Xác nhận</button>{" "}
                <button className="btn secondary" onClick={() => updateStatus(r.id, "cancelled")}>Huỷ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
