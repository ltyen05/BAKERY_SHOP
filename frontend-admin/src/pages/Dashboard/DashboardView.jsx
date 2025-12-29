import React, { useState } from 'react';
import './DashboardView.css';

export default function DashboardView() {
  const [period, setPeriod] = useState('month');

  // Mock data
  const stats = {
    revenue: { value: '125.5M', change: 12.5 },
    orders: { value: '2,847', change: 8.3 },
    customers: { value: '1,234', change: -3.2 },
    products: { value: '456', change: 5.7 }
  };

  // Revenue chart data (7 days)
  const revenueChart = [
    { day: 'Mon', value: 15.2 },
    { day: 'Tue', value: 18.5 },
    { day: 'Wed', value: 22.3 },
    { day: 'Thu', value: 19.8 },
    { day: 'Fri', value: 25.6 },
    { day: 'Sat', value: 30.2 },
    { day: 'Sun', value: 28.4 }
  ];

  const maxRevenue = Math.max(...revenueChart.map(d => d.value));

  // Top products with images/icons
  const topProducts = [
    { 
      name: 'Croissant Bơ', 
      sales: 234, 
      revenue: '58.5M₫', 
      change: 15.3,
      icon: '🥐',
      percentage: 100
    },
    { 
      name: 'Bánh Tiramisu', 
      sales: 187, 
      revenue: '71.1M₫', 
      change: 8.7,
      icon: '🍰',
      percentage: 80
    },
    { 
      name: 'Chocolate Cake', 
      sales: 156, 
      revenue: '49.9M₫', 
      change: -2.4,
      icon: '🎂',
      percentage: 67
    },
    { 
      name: 'Macaron', 
      sales: 143, 
      revenue: '64.4M₫', 
      change: 12.1,
      icon: '🍬',
      percentage: 61
    },
    { 
      name: 'Red Velvet', 
      sales: 128, 
      revenue: '53.8M₫', 
      change: 5.6,
      icon: '🧁',
      percentage: 55
    }
  ];

  // Order status distribution
  const orderStats = [
    { status: 'Completed', count: 1542, color: '#10b981', percentage: 54 },
    { status: 'Pending', count: 487, color: '#f59e0b', percentage: 17 },
    { status: 'Shipping', count: 623, color: '#3b82f6', percentage: 22 },
    { status: 'Cancelled', count: 195, color: '#ef4444', percentage: 7 }
  ];

  // Recent orders
  const recentOrders = [
    { id: '#ORD-001', customer: 'Nguyễn Văn A', product: 'Croissant Bơ', amount: '250,000₫', status: 'completed', time: '5 phút trước' },
    { id: '#ORD-002', customer: 'Trần Thị B', product: 'Bánh Tiramisu', amount: '380,000₫', status: 'pending', time: '12 phút trước' },
    { id: '#ORD-003', customer: 'Lê Hoàng C', product: 'Bánh Chocolate', amount: '320,000₫', status: 'completed', time: '25 phút trước' },
    { id: '#ORD-004', customer: 'Phạm Minh D', product: 'Macaron', amount: '450,000₫', status: 'shipping', time: '1 giờ trước' },
    { id: '#ORD-005', customer: 'Hoàng Thu E', product: 'Red Velvet', amount: '420,000₫', status: 'completed', time: '2 giờ trước' }
  ];

  // Customer growth data
  const customerGrowth = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 48 },
    { month: 'Apr', value: 61 },
    { month: 'May', value: 70 },
    { month: 'Jun', value: 85 }
  ];

  const maxCustomers = Math.max(...customerGrowth.map(d => d.value));

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="period-selector">
          <button className={period === 'day' ? 'active' : ''} onClick={() => setPeriod('day')}>Today</button>
          <button className={period === 'week' ? 'active' : ''} onClick={() => setPeriod('week')}>Week</button>
          <button className={period === 'month' ? 'active' : ''} onClick={() => setPeriod('month')}>Month</button>
          <button className={period === 'year' ? 'active' : ''} onClick={() => setPeriod('year')}>Year</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">{stats.revenue.value}</h3>
            <div className={`stat-change ${stats.revenue.change >= 0 ? 'up' : 'down'}`}>
              {stats.revenue.change >= 0 ? '↑' : '↓'} {Math.abs(stats.revenue.change)}% vs last {period}
            </div>
          </div>
        </div>

        <div className="stat-card stat-orders">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <h3 className="stat-value">{stats.orders.value}</h3>
            <div className={`stat-change ${stats.orders.change >= 0 ? 'up' : 'down'}`}>
              {stats.orders.change >= 0 ? '↑' : '↓'} {Math.abs(stats.orders.change)}% vs last {period}
            </div>
          </div>
        </div>

        <div className="stat-card stat-customers">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <p className="stat-label">Total Customers</p>
            <h3 className="stat-value">{stats.customers.value}</h3>
            <div className={`stat-change ${stats.customers.change >= 0 ? 'up' : 'down'}`}>
              {stats.customers.change >= 0 ? '↑' : '↓'} {Math.abs(stats.customers.change)}% vs last {period}
            </div>
          </div>
        </div>

        <div className="stat-card stat-products">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <h3 className="stat-value">{stats.products.value}</h3>
            <div className={`stat-change ${stats.products.change >= 0 ? 'up' : 'down'}`}>
              {stats.products.change >= 0 ? '↑' : '↓'} {Math.abs(stats.products.change)}% vs last {period}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Revenue Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Revenue Overview</h3>
              <p className="chart-subtitle">Daily revenue for this week</p>
            </div>
            <div className="chart-total">
              <span className="chart-total-label">Total</span>
              <span className="chart-total-value">160.0M₫</span>
            </div>
          </div>
          <div className="revenue-chart">
            {revenueChart.map((data, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div 
                  className="chart-bar"
                  style={{ 
                    height: `${(data.value / maxRevenue) * 100}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="chart-value">{data.value}M</div>
                </div>
                <div className="chart-label">{data.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Order Status</h3>
              <p className="chart-subtitle">Distribution of order statuses</p>
            </div>
          </div>
          <div className="order-distribution">
            {orderStats.map((stat, index) => (
              <div key={index} className="order-stat-item">
                <div className="order-stat-header">
                  <div className="order-stat-label">
                    <div className="order-stat-dot" style={{ background: stat.color }}></div>
                    {stat.status}
                  </div>
                  <div className="order-stat-value">{stat.count}</div>
                </div>
                <div className="order-stat-bar">
                  <div 
                    className="order-stat-fill" 
                    style={{ 
                      width: `${stat.percentage}%`,
                      background: stat.color,
                      animationDelay: `${index * 0.1}s`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Top Products - Bestsellers */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h3>🔥 Best Selling Products</h3>
              <p className="section-subtitle">Top 5 products by sales volume</p>
            </div>
            <a href="/products" className="view-all">View all →</a>
          </div>
          <div className="products-list">
            {topProducts.map((product, index) => (
              <div key={index} className="product-item-detailed">
                <div className="product-left">
                  <div className="product-rank-badge">#{index + 1}</div>
                  <div className="product-icon-large">{product.icon}</div>
                  <div className="product-info-detailed">
                    <div className="product-name-large">{product.name}</div>
                    <div className="product-stats-detailed">
                      <span className="product-sales">{product.sales} orders</span>
                      <span className="separator">•</span>
                      <span className="product-revenue-text">{product.revenue}</span>
                    </div>
                  </div>
                </div>
                <div className="product-right">
                  <div className="product-progress">
                    <div className="product-progress-bar">
                      <div 
                        className="product-progress-fill" 
                        style={{ 
                          width: `${product.percentage}%`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      ></div>
                    </div>
                    <span className="product-progress-text">{product.percentage}%</span>
                  </div>
                  <div className={`product-change-badge ${product.change >= 0 ? 'positive' : 'negative'}`}>
                    {product.change >= 0 ? '↑' : '↓'} {Math.abs(product.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Growth Chart */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h3>Customer Growth</h3>
              <p className="section-subtitle">New customers per month</p>
            </div>
          </div>
          <div className="customer-chart">
            <div className="customer-chart-bars">
              {customerGrowth.map((data, index) => (
                <div key={index} className="customer-bar-wrapper">
                  <div 
                    className="customer-bar"
                    style={{ 
                      height: `${(data.value / maxCustomers) * 100}%`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="customer-value">{data.value}</div>
                  </div>
                  <div className="customer-label">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-section recent-orders-full">
        <div className="section-header">
          <h3>Recent Orders</h3>
          <a href="/orders" className="view-all">View all →</a>
        </div>
        <div className="orders-list">
          {recentOrders.map(order => (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <div className="order-id">{order.id}</div>
                <div className="order-details">
                  <div className="order-customer">{order.customer}</div>
                  <div className="order-product">{order.product}</div>
                </div>
              </div>
              <div className="order-meta">
                <div className="order-amount">{order.amount}</div>
                <span className={`order-status status-${order.status}`}>
                  {order.status === 'completed' ? 'Hoàn thành' : 
                   order.status === 'pending' ? 'Chờ xử lý' : 
                   order.status === 'shipping' ? 'Đang giao' : 'Đã hủy'}
                </span>
                <div className="order-time">🕐 {order.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}