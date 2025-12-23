import "./DashboardView.css";
import { FaUsers, FaShoppingCart, FaDollarSign } from "react-icons/fa";

export default function DashboardView() {
  return (
    <div className="dashboard">
      {/* TOP STAT CARDS */}
      <div className="cards">
        <div className="card">
          <div className="icon icon-orange">
            <FaShoppingCart />
          </div>
          <div>
            <p>Total Orders</p>
            <h2>48,652</h2>
          </div>
        </div>

        <div className="card">
          <div className="icon icon-orange">
            <FaUsers />
          </div>
          <div>
            <p>Total Customer</p>
            <h2>1,248</h2>
          </div>
        </div>

        <div className="card">
          <div className="icon icon-orange">
            <FaDollarSign />
          </div>
          <div>
            <p>Total Revenue</p>
            <h2>$215,860</h2>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid">
        <div className="box box-large">
          <h3>Total Revenue</h3>
          <div className="chart-placeholder">Line Chart</div>
        </div>

        <div className="box">
          <h3>Top Categories</h3>
          <div className="chart-placeholder">Donut Chart</div>
        </div>

        <div className="box">
          <h3>Trending Menus</h3>
          <div className="menu">
            <img
              src="https://images.unsplash.com/photo-1604908177225-0bdbd7a3f9b2"
              alt="food"
            />
            <div>
              <h4>Grilled Chicken Delight</h4>
              <span className="price">$18.00</span>
            </div>
          </div>
        </div>

        <div className="box box-large">
          <h3>Orders Overview</h3>
          <div className="chart-placeholder">Bar Chart</div>
        </div>

        <div className="box">
          <h3>Order Types</h3>
          <ul className="order-types">
            <li>
              <span>Dine In</span>
              <strong>45%</strong>
            </li>
            <li>
              <span>Takeaway</span>
              <strong>30%</strong>
            </li>
            <li>
              <span>Online</span>
              <strong>25%</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
