/* =============================================== */
/* Location: src/pages/DashboardView.jsx - FIXED API INTEGRATION */
/* =============================================== */
import React, { useState, useEffect } from 'react';
import dashboardApi from '../../api/dashboardApi';
import './DashboardView.css';

export default function DashboardView() {
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: { revenue: 0, orders: 0, customers: 0, products: 0 },
    revenueChart: [],
    orderStats: [],
    topProducts: [],
    customerGrowth: [],
    recentOrders: []
  });

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const result = await dashboardApi.getAllDashboardData(month, year);
      
      if (result.success) {
        console.log('✅ Dashboard data loaded:', result.data);
        
        setDashboardData({
          stats: {
            revenue: result.data.stats.amount || 0,
            orders: result.data.stats.orders || 0,
            customers: result.data.stats.customers || 0,
            products: result.data.stats.products || 0
          },
          orderStats: result.data.orderStatus?.distribution || [],
          topProducts: result.data.topProducts || [],
          customerGrowth: result.data.customerGrowth || [],
          
          // Mock data - chưa có API
          revenueChart: [
            { day: 'Mon', value: 15.2 },
            { day: 'Tue', value: 18.5 },
            { day: 'Wed', value: 22.3 },
            { day: 'Thu', value: 19.8 },
            { day: 'Fri', value: 25.6 },
            { day: 'Sat', value: 30.2 },
            { day: 'Sun', value: 28.4 }
          ],
          recentOrders: [
            { id: '#ORD-001', customer: 'Nguyễn Văn A', product: 'Croissant Bơ', amount: '250,000₫', status: 'completed', time: '5 phút trước' },
            { id: '#ORD-002', customer: 'Trần Thị B', product: 'Bánh Tiramisu', amount: '380,000₫', status: 'pending', time: '12 phút trước' },
            { id: '#ORD-003', customer: 'Lê Hoàng C', product: 'Bánh Chocolate', amount: '320,000₫', status: 'completed', time: '25 phút trước' },
            { id: '#ORD-004', customer: 'Phạm Minh D', product: 'Macaron', amount: '450,000₫', status: 'shipping', time: '1 giờ trước' },
            { id: '#ORD-005', customer: 'Hoàng Thu E', product: 'Red Velvet', amount: '420,000₫', status: 'completed', time: '2 giờ trước' }
          ]
        });
      }
    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0₫';
    
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M₫`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K₫`;
    }
    return `${amount.toLocaleString()}₫`;
  };

  const mapOrderStatus = (status) => {
    const statusMap = {
      'Completed': { label: 'Hoàn thành', color: '#10b981' },
      'Pending': { label: 'Chờ xử lý', color: '#f59e0b' },
      'Shipping': { label: 'Đang giao', color: '#3b82f6' },
      'Cancelled': { label: 'Đã hủy', color: '#ef4444' }
    };
    return statusMap[status] || { label: status, color: '#6b7280' };
  };

  const maxRevenue = Math.max(...dashboardData.revenueChart.map(d => d.value), 1);
  const maxCustomers = Math.max(...dashboardData.customerGrowth.map(d => d.customers || 0), 1);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '18px', color: '#6b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h2>Đang tải dữ liệu Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
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

      <div className="stats-grid">
        <div className="stat-card stat-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">{formatCurrency(dashboardData.stats.revenue)}</h3>
            <div className="stat-change up">↑ 12.5% vs last {period}</div>
          </div>
        </div>

        <div className="stat-card stat-orders">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <h3 className="stat-value">{dashboardData.stats.orders.toLocaleString()}</h3>
            <div className="stat-change up">↑ 8.3% vs last {period}</div>
          </div>
        </div>

        <div className="stat-card stat-customers">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <p className="stat-label">Total Customers</p>
            <h3 className="stat-value">{dashboardData.stats.customers.toLocaleString()}</h3>
            <div className="stat-change down">↓ 3.2% vs last {period}</div>
          </div>
        </div>

        <div className="stat-card stat-products">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <h3 className="stat-value">{dashboardData.stats.products.toLocaleString()}</h3>
            <div className="stat-change up">↑ 5.7% vs last {period}</div>
          </div>
        </div>
      </div>

      <div className="charts-row">
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
            {dashboardData.revenueChart.map((data, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div className="chart-bar" style={{ height: `${(data.value / maxRevenue) * 100}%`, animationDelay: `${index * 0.1}s` }}>
                  <div className="chart-value">{data.value}M</div>
                </div>
                <div className="chart-label">{data.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Order Status</h3>
              <p className="chart-subtitle">Distribution of order statuses</p>
            </div>
          </div>
          <div className="order-distribution">
            {dashboardData.orderStats.length > 0 ? (
              dashboardData.orderStats.map((stat, index) => {
                const statusInfo = mapOrderStatus(stat.name);
                return (
                  <div key={index} className="order-stat-item">
                    <div className="order-stat-header">
                      <div className="order-stat-label">
                        <div className="order-stat-dot" style={{ background: statusInfo.color }}></div>
                        {statusInfo.label}
                      </div>
                      <div className="order-stat-value">{stat.value}</div>
                    </div>
                    <div className="order-stat-bar">
                      <div className="order-stat-fill" style={{ width: `${stat.percentage}%`, background: statusInfo.color, animationDelay: `${index * 0.1}s` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>Chưa có dữ liệu đơn hàng</p>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h3>🔥 Best Selling Products</h3>
              <p className="section-subtitle">Top 5 products by sales volume</p>
            </div>
          </div>
          <div className="products-list">
            {dashboardData.topProducts.length > 0 ? (
              dashboardData.topProducts.map((product, index) => (
                <div key={index} className="product-item-detailed">
                  <div className="product-left">
                    <div className="product-rank-badge">#{index + 1}</div>
                    <div className="product-icon-large">
                      {product.image ? (
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                      ) : '🥐'}
                    </div>
                    <div className="product-info-detailed">
                      <div className="product-name-large">{product.name}</div>
                      <div className="product-stats-detailed">
                        <span className="product-sales">{product.orders} orders</span>
                        <span className="separator">•</span>
                        <span className="product-revenue-text">{product.revenue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="product-right">
                    <div className="product-progress">
                      <div className="product-progress-bar">
                        <div className="product-progress-fill" style={{ width: `${product.percentage}%`, animationDelay: `${index * 0.1}s` }}></div>
                      </div>
                      <span className="product-progress-text">{product.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>Chưa có sản phẩm bán chạy</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <h3>Customer Growth</h3>
              <p className="section-subtitle">New customers per month</p>
            </div>
          </div>
          <div className="customer-chart">
            <div className="customer-chart-bars">
              {dashboardData.customerGrowth.length > 0 ? (
                dashboardData.customerGrowth.map((data, index) => (
                  <div key={index} className="customer-bar-wrapper">
                    <div className="customer-bar" style={{ height: `${(data.customers / maxCustomers) * 100}%`, animationDelay: `${index * 0.1}s` }}>
                      <div className="customer-value">{data.customers}</div>
                    </div>
                    <div className="customer-label">{data.month}</div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#6b7280', width: '100%', padding: '40px' }}>Chưa có dữ liệu khách hàng</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section recent-orders-full">
        <div className="section-header">
          <h3>Recent Orders</h3>
        </div>
        <div className="orders-list">
          {dashboardData.recentOrders.map(order => (
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