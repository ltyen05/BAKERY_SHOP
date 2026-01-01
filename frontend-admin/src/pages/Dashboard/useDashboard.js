// ===============================================
// FILE: src/pages/Dashboard/useDashboard.js
// Custom Hook cho Dashboard - Phân quyền Admin/Super Admin
// ===============================================
import { useState, useEffect } from 'react';
import { message } from 'antd';
import { dashboardApi } from '../../api/dashboardApi';
import { useAuth } from '../../context/AuthContext';

export const useDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [period, setPeriod] = useState('month'); // month hoặc week

  // Branch Admin Data
  const [branchStats, setBranchStats] = useState({
    orders: 0,
    amount: 0,
    customers: 0,
    products: 0
  });
  const [orderStatus, setOrderStatus] = useState({ total_orders: 0, distribution: [] });
  const [topProducts, setTopProducts] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);

  // Super Admin Data
  const [revenuePerBranch, setRevenuePerBranch] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);

  // Kiểm tra role
  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'admin';

  // Load data khi component mount hoặc khi thay đổi tháng/năm
  useEffect(() => {
    loadDashboardData();
  }, [selectedMonth, selectedYear, period, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (isSuperAdmin) {
        // Load data cho Super Admin
        await loadSuperAdminData();
      } else if (isAdmin) {
        // Load data cho Branch Admin
        await loadBranchAdminData();
      }
    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
      message.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Load data cho Branch Admin
  const loadBranchAdminData = async () => {
    try {
      console.log('🔄 Loading Branch Admin data...');

      // Load parallel tất cả API
      const [orders, amount, customers, products, orderStatusRes, topProductsRes, customerGrowthRes] = 
        await Promise.all([
          dashboardApi.getTotalOrders(selectedMonth, selectedYear),
          dashboardApi.getTotalAmount(selectedMonth, selectedYear),
          dashboardApi.getTotalCustomers(selectedMonth, selectedYear),
          dashboardApi.getTotalProducts(selectedMonth, selectedYear),
          dashboardApi.getOrderStatusDistribution(),
          dashboardApi.getTopProducts(),
          dashboardApi.getCustomerGrowth()
        ]);

      // Update state
      setBranchStats({
        orders: orders.data || 0,
        amount: amount.data || 0,
        customers: customers.data || 0,
        products: products.data || 0
      });

      setOrderStatus(orderStatusRes.data || { total_orders: 0, distribution: [] });
      setTopProducts(topProductsRes.data || []);
      setCustomerGrowth(customerGrowthRes.data || []);

      console.log('✅ Branch Admin data loaded');
    } catch (error) {
      console.error('❌ Error loading branch data:', error);
      throw error;
    }
  };

  // Load data cho Super Admin
  const loadSuperAdminData = async () => {
    try {
      console.log('🔄 Loading Super Admin data...');

      // Load parallel tất cả API
      const [revenueRes, orderStatsRes, revenueChartRes] = 
        await Promise.all([
          dashboardApi.getRevenuePerBranch(),
          dashboardApi.getOrderStats(),
          dashboardApi.getRevenueChart(period)
        ]);

      // Update state
      setRevenuePerBranch(revenueRes.data || []);
      setOrderStats(orderStatsRes.data || []);
      setRevenueChart(revenueChartRes.data || []);

      console.log('✅ Super Admin data loaded');
    } catch (error) {
      console.error('❌ Error loading super admin data:', error);
      throw error;
    }
  };

  // Handle thay đổi tháng
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  // Handle thay đổi năm
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  // Handle thay đổi period (month/week)
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  // Refresh data
  const refreshData = () => {
    loadDashboardData();
  };

  return {
    // Common
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
  };
};