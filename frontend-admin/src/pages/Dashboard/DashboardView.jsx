import "./DashboardView.css";
import { FaShoppingBag, FaUsers, FaDollarSign, FaStar } from "react-icons/fa";

export default function DashboardView() {
  return (
    <div className="dashboard-wrapper">

      {/* LEFT SECTION */}
      <div className="left-section">

        {/* TOP STAT CARDS */}
        <div className="top-cards">

          <div className="stat-card">
            <div className="stat-icon orange-bg"><FaShoppingBag /></div>
            <p className="stat-title">Total Orders</p>
            <h2 className="stat-value">48,652</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow-bg"><FaUsers /></div>
            <p className="stat-title">Total Customers</p>
            <h2 className="stat-value">1,248</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon green-bg"><FaDollarSign /></div>
            <p className="stat-title">Total Revenue</p>
            <h2 className="stat-value">$215,860</h2>
          </div>

        </div>

        {/* SECTION: REVENUE CHART */}
        <div className="section-card">
          <h3>Total Revenue</h3>
          <div className="chart-placeholder">[Revenue Chart]</div>
        </div>

        {/* SECTION: ORDERS BAR */}
        <div className="section-card">
          <h3>Orders Overview</h3>
          <div className="chart-placeholder">[Orders Bar Chart]</div>
        </div>

        {/* SECTION: ORDER TYPES */}
        <div className="section-card">
          <h3>Order Types</h3>
          <div>Dine-In: 900</div>
          <div>Takeaway: 600</div>
          <div>Online: 500</div>
        </div>

        {/* SECTION: RECENT ORDERS */}
        <div className="section-card">
          <h3>Recent Orders</h3>
          <ul className="recent-orders">
            <li>Order #1023 – Completed</li>
            <li>Order #1024 – Pending</li>
            <li>Order #1025 – Cancelled</li>
          </ul>
        </div>

      </div>


      {/* RIGHT SECTION */}
      <div className="right-section">

        {/* TOP CATEGORIES */}
        <div className="sidebar-card">
          <h3>Top Categories</h3>
          <div className="donut-placeholder">[Donut Chart]</div>

          <ul className="category-list">
            <li><span className="dot seafood"></span>Seafood – 30%</li>
            <li><span className="dot beverage"></span>Beverages – 25%</li>
            <li><span className="dot dessert"></span>Dessert – 25%</li>
            <li><span className="dot pasta"></span>Pasta – 20%</li>
          </ul>
        </div>

        {/* TRENDING MENUS */}
        <div className="sidebar-card">
          <h3>Trending Menus</h3>

          <div className="menu-card">
            <img src="https://picsum.photos/300/200" alt="" />
            <p className="item-name">Grilled Chicken Delight</p>
            <div className="item-info">
              <span><FaStar className="star" /> 4.9</span>
              <span>350</span>
              <span className="price">$18.00</span>
            </div>
          </div>

          <div className="menu-card">
            <img src="https://picsum.photos/300/201" alt="" />
            <p className="item-name">Sunny Citrus Cake</p>
            <div className="item-info">
              <span><FaStar className="star" /> 4.8</span>
              <span>400</span>
              <span className="price">$8.50</span>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="sidebar-card">
          <h3>Recent Activity</h3>
          <div className="activity-item">
            <span>Updated Inventory - 10 units of Organic Chicken Breast</span>
            <span className="activity-time">11:20 AM</span>
          </div>
          <div className="activity-item">
            <span>Marked Order #ORD1028 as completed</span>
            <span className="activity-time">10:00 AM</span>
          </div>
          <div className="activity-item">
            <span>Added new reservation for 4 guests at 7:00 PM</span>
            <span className="activity-time">10:30 AM</span>
          </div>
        </div>

      </div>

    </div>
  );
}
