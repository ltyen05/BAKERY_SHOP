// ===============================================
// FILE: src/pages/Dashboard/DashboardView.jsx
// ===============================================
import React from "react";
import { Card, Row, Col, Select, Button, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "./useDashboard";
import "./DashboardView.css";

const { Option } = Select;

// Component chính
const DashboardView = () => {
  const {
    loading,
    isSuperAdmin,
    isAdmin,
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    refreshData,
    // Branch Admin data
    branchStats,
    orderStatus,
    topProducts,
    customerGrowth,
    // Super Admin data
    revenuePerBranch,
    orderStats,
    revenueChart,
  } = useDashboard();

  // 🔍 DEBUG: Log để kiểm tra
  console.log("[DashboardView] Render with:", {
    loading,
    isSuperAdmin,
    isAdmin,
    branchStats,
    orderStatus,
    topProducts,
    customerGrowth,
    revenuePerBranch,
    orderStats,
    revenueChart
  });

  // Render loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh' 
        }}>
          <Spin size="large" tip="Đang tải dữ liệu dashboard..." />
        </div>
      </div>
    );
  }

  // 🔍 DEBUG: Kiểm tra role
  if (!isSuperAdmin && !isAdmin) {
    console.warn("[DashboardView] No valid role detected!");
    return (
      <div className="dashboard-container">
        <Card>
          <h2>Không xác định được quyền truy cập</h2>
          <p>Vui lòng liên hệ quản trị viên.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header with filters */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            {isSuperAdmin ? "Dashboard Tổng Quan" : "Dashboard Chi Nhánh"}
          </h1>
          <p className="dashboard-subtitle">
            Tổng quan hoạt động kinh doanh
          </p>
        </div>

        <div className="dashboard-controls">
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            style={{ width: 120 }}
          >
            <Option value={null}>Cả năm</Option>
            {[...Array(12)].map((_, i) => (
              <Option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </Option>
            ))}
          </Select>

          <Select
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: 120 }}
          >
            {[2023, 2024, 2025].map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>

          <Button icon={<ReloadOutlined />} onClick={refreshData}>
            Làm mới
          </Button>
        </div>
      </div>

      {/* Content based on role */}
      {isAdmin && (
        <div>
          {/* Branch Admin Stats */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <h3>Doanh Thu</h3>
                <p style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {branchStats.amount?.toLocaleString('vi-VN')}đ
                </p>
              </Card>
            </Col>
            {/* Add more stat cards */}
          </Row>

          {/* Charts */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={12}>
              <Card title="Trạng thái đơn hàng" className="chart-card">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatus.distribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {orderStatus.distribution?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Tăng trưởng khách hàng" className="chart-card">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={customerGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="customers" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {isSuperAdmin && (
        <div>
          {/* Super Admin Charts */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Doanh thu theo chi nhánh" className="chart-card">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenuePerBranch}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="branch_name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

// ✅ QUAN TRỌNG: Export default để lazy loading hoạt động
export default DashboardView;