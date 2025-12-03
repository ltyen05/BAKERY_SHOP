import './DashboardView.css';

export default function DashboardView() {
  return (
    <div className="dashboard">
      <h2>Tổng quan Hus Bakery</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Doanh thu</h4>
          <div className="stat-value">2.027.000 VNĐ</div>
          <div className="stat-trend">-12% so với tuần trước</div>
        </div>
        <div className="stat-card">
          <h4>Khách hàng</h4>
          <div className="stat-value">227</div>
          <div className="stat-trend">0% so với hôm qua</div>
        </div>
        <div className="stat-card">
          <h4>Sản phẩm đã bán</h4>
          <div className="stat-value">127</div>
          <div className="stat-trend">+12% so với tuần trước</div>
        </div>
        <div className="stat-card">
          <h4>Chờ thanh toán</h4>
          <div className="stat-value">12</div>
          <div className="stat-trend">+5% so với tuần trước</div>
        </div>
      </div>
    </div>
  );
}
