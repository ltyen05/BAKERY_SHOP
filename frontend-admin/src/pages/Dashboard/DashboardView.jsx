// ===============================================
// FILE: src/pages/Dashboard/DashboardView.jsx
// Dashboard phân quyền Admin/Super Admin
// ===============================================
import { Row, Col, Card, Select, Button, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { 
  FiShoppingCart, 
  FiDollarSign, 
  FiUsers, 
  FiPackage 
} from 'react-icons/fi';
import StatsCard from '../../components/StatsCard/StatsCard';
import { useDashboard } from './useDashboard';
import './DashboardView.css';

const DashboardView = () => {
  const {
    loading,
    isSuperAdmin,
    isAdmin,
    selectedMonth,
    selectedYear,
    period,
    handleMonthChange,
    handleYearChange,
    handlePeriodChange,
    refreshData,
    
    // Branch Admin Data
    branchStats,
    orderStatus,
    topProducts,
    customerGrowth,
    
    // Super Admin Data
    revenuePerBranch,
    orderStats,
    revenueChart
  } = useDashboard();

  // Tạo options cho select month
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`
  }));

  // Tạo options cho select year
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: `${currentYear - i}`
  }));

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh' 
      }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            {isSuperAdmin ? 'Dashboard Tổng Quan' : 'Dashboard Chi Nhánh'}
          </h1>
          <p className="dashboard-subtitle">
            {isSuperAdmin 
              ? 'Theo dõi hiệu suất toàn hệ thống' 
              : `Dữ liệu tháng ${selectedMonth}/${selectedYear}`}
          </p>
        </div>

        <div className="dashboard-controls">
          {/* Chỉ hiện select month/year cho Branch Admin */}
          {isAdmin && (
            <>
              <Select
                value={selectedMonth}
                onChange={handleMonthChange}
                options={monthOptions}
                style={{ width: 120 }}
              />
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                options={yearOptions}
                style={{ width: 100 }}
              />
            </>
          )}

          {/* Period selector cho Super Admin */}
          {isSuperAdmin && (
            <Select
              value={period}
              onChange={handlePeriodChange}
              options={[
                { value: 'month', label: 'Theo tháng' },
                { value: 'week', label: 'Theo tuần' }
              ]}
              style={{ width: 130 }}
            />
          )}

          <Button 
            icon={<ReloadOutlined />} 
            onClick={refreshData}
          >
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards - Branch Admin */}
      {isAdmin && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="Tổng đơn hàng"
              value={branchStats.orders}
              color="purple"
              icon={FiShoppingCart}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="Doanh thu"
              value={formatCurrency(branchStats.amount)}
              color="green"
              icon={FiDollarSign}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="Khách hàng"
              value={branchStats.customers}
              color="blue"
              icon={FiUsers}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="Sản phẩm bán"
              value={branchStats.products}
              color="orange"
              icon={FiPackage}
            />
          </Col>
        </Row>
      )}

      {/* Charts - Branch Admin */}
      {isAdmin && (
        <>
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={12}>
              <Card title="Phân bố trạng thái đơn hàng">
                {orderStatus.distribution.length > 0 ? (
                  <div>
                    {orderStatus.distribution.map((item, index) => (
                      <div key={index} style={{ marginBottom: 12 }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          marginBottom: 4
                        }}>
                          <span>{item.status}</span>
                          <span style={{ fontWeight: 600 }}>{item.count}</span>
                        </div>
                        <div style={{ 
                          height: 8, 
                          background: '#f0f0f0', 
                          borderRadius: 4 
                        }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${(item.count / orderStatus.total_orders) * 100}%`,
                            background: '#667eea',
                            borderRadius: 4
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#999' }}>
                    Chưa có dữ liệu
                  </p>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Top sản phẩm bán chạy">
                {topProducts.length > 0 ? (
                  <div>
                    {topProducts.slice(0, 5).map((product, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 12,
                        padding: 8,
                        background: '#f9fafb',
                        borderRadius: 8
                      }}>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          style={{ 
                            width: 50, 
                            height: 50, 
                            borderRadius: 8,
                            objectFit: 'cover'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>{product.name}</div>
                          <div style={{ fontSize: 13, color: '#64748b' }}>
                            Đã bán: {product.total_sold}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, color: '#667eea' }}>
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#999' }}>
                    Chưa có dữ liệu
                  </p>
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24}>
              <Card title="Tăng trưởng khách hàng">
                {customerGrowth.length > 0 ? (
                  <div style={{ 
                    display: 'flex', 
                    gap: 8,
                    overflowX: 'auto',
                    padding: '16px 0'
                  }}>
                    {customerGrowth.map((item, index) => (
                      <div key={index} style={{ 
                        minWidth: 80,
                        textAlign: 'center'
                      }}>
                        <div style={{ 
                          height: 120,
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center'
                        }}>
                          <div style={{ 
                            width: 40,
                            height: `${(item.customers / Math.max(...customerGrowth.map(g => g.customers))) * 100}%`,
                            background: '#667eea',
                            borderRadius: '4px 4px 0 0',
                            minHeight: 10
                          }} />
                        </div>
                        <div style={{ 
                          marginTop: 8,
                          fontSize: 12,
                          color: '#64748b'
                        }}>
                          {item.month}
                        </div>
                        <div style={{ 
                          fontWeight: 600,
                          fontSize: 14
                        }}>
                          {item.customers}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#999' }}>
                    Chưa có dữ liệu
                  </p>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Charts - Super Admin */}
      {isSuperAdmin && (
        <>
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={12}>
              <Card title="Doanh thu theo chi nhánh">
                {revenuePerBranch.length > 0 ? (
                  <div>
                    {revenuePerBranch.map((branch, index) => (
                      <div key={index} style={{ marginBottom: 16 }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          marginBottom: 6
                        }}>
                          <span style={{ fontWeight: 600 }}>
                            {branch.branch_name}
                          </span>
                          <span style={{ color: '#10b981', fontWeight: 700 }}>
                            {formatCurrency(branch.total_revenue)}
                          </span>
                        </div>
                        <div style={{ 
                          height: 10, 
                          background: '#f0f0f0', 
                          borderRadius: 5 
                        }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${(branch.total_revenue / Math.max(...revenuePerBranch.map(b => b.total_revenue))) * 100}%`,
                            background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                            borderRadius: 5
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#999' }}>
                    Chưa có dữ liệu
                  </p>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Thống kê đơn hàng toàn hệ thống">
                {orderStats.length > 0 ? (
                  <div>
                    {orderStats.map((stat, index) => (
                      <div key={index} style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: '#f9fafb',
                        borderRadius: 8,
                        marginBottom: 12
                      }}>
                        <span style={{ fontWeight: 600 }}>{stat.status}</span>
                        <span style={{ 
                          fontSize: 20,
                          fontWeight: 700,
                          color: '#667eea'
                        }}>
                          {stat.count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#999' }}>
                    Chưa có dữ liệu
                  </p>
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24}>
              <Card title={`Biểu đồ doanh thu (${period === 'month' ? 'Theo tháng' : 'Theo tuần'})`}>
                {revenueChart.length > 0 ? (
                  <div style={{ 
                    display: 'flex',
                    gap: 16,
                    overflowX: 'auto',
                    padding: '16px 0'
                  }}>
                    {revenueChart.map((item, index) => {
                      // Lấy tất cả branch names (bỏ qua key "time")
                      const branches = Object.keys(item).filter(key => key !== 'time');
                      
                      return (
                        <div key={index} style={{ minWidth: 100, textAlign: 'center' }}>
                          <div style={{ 
                            height: 150,
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            gap: 4
                          }}>
                            {branches.map((branchName, bIndex) => (
                              <div key={bIndex} style={{ 
                                width: 30,
                                height: `${(item[branchName] / Math.max(...revenueChart.flatMap(d => branches.map(b => d[b])))) * 100}%`,
                                background: `hsl(${(bIndex * 60) % 360}, 70%, 60%)`,
                                borderRadius: '4px 4px 0 0',
                                minHeight: 10
                              }} />
                            ))}
                          </div>
                          <div style={{ 
                            marginTop: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#64748b'
                          }}>
                            {period === 'month' ? `T${item.time}` : `W${item.time}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#999' }}>
                    Chưa có dữ liệu
                  </p>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DashboardView;