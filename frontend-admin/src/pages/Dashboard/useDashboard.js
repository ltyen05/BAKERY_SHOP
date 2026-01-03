// ===============================================
// FILE: src/pages/Dashboard/useDashboard.js (FIXED)
// ===============================================
import { useState, useEffect } from "react";
import { message } from "antd";
import dashboardApi from "../../api/dashboardApi";
import { useAuth } from "../../context/AuthContext";

export const useDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Branch Admin Data
  const [branchStats, setBranchStats] = useState({
    amount: 0,
    orders: 0,
    customers: 0,
    products: 0,
  });
  const [orderStatus, setOrderStatus] = useState({
    total_orders: 0,
    distribution: [],
  });
  const [topProducts, setTopProducts] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);

  // Super Admin Data
  const [revenuePerBranch, setRevenuePerBranch] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);

  // ✅ Role detection
  const isSuperAdmin = 
    user?.role === "super_admin" || 
    (user?.role === "employee" && !user?.branch_id);
  
  const isAdmin = 
    user?.role === "admin" || 
    user?.role === "super_admin_viewing_branch" ||
    (user?.role === "employee" && user?.branch_id);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log("[useDashboard] Loading data for:", {
        isSuperAdmin,
        isAdmin,
        month: selectedMonth,
        year: selectedYear,
        user
      });

      if (isSuperAdmin) {
        await loadSuperAdminData();
      } else if (isAdmin) {
        await loadBranchAdminData();
      }
    } catch (error) {
      console.error("[useDashboard] Error:", error);
      message.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadBranchAdminData = async () => {
    console.log("[useDashboard] Loading Branch Admin data...");

    try {
      // ✅ FIX: Đúng thứ tự tham số (year, month)
      const [ordersRes, amountRes, customersRes, productsRes, orderStatusRes, topProductsRes, customerGrowthRes] =
        await Promise.all([
          dashboardApi.getTotalOrders(selectedYear, selectedMonth),
          dashboardApi.getTotalAmount(selectedYear, selectedMonth),
          dashboardApi.getTotalCustomers(selectedYear, selectedMonth),
          dashboardApi.getTotalProducts(selectedYear, selectedMonth),
          dashboardApi.getOrderStatusDistribution(),
          dashboardApi.getTopProducts(5),
          dashboardApi.getCustomerGrowth(),
        ]);

      console.log("[useDashboard] Branch data received:", {
        orders: ordersRes,
        amount: amountRes,
        customers: customersRes,
        products: productsRes,
        orderStatus: orderStatusRes,
        topProducts: topProductsRes,
        customerGrowth: customerGrowthRes,
      });

      // ✅ Extract data safely
      const extractData = (res) => {
        if (typeof res.data === 'number') return res.data;
        if (res.data?.data !== undefined) return res.data.data;
        if (res.status === 'success' && res.data !== undefined) return res.data;
        return 0;
      };

      setBranchStats({
        orders: extractData(ordersRes),
        amount: extractData(amountRes),
        customers: extractData(customersRes),
        products: extractData(productsRes),
      });

      // ✅ Order status
      const orderStatusData = orderStatusRes.data?.data || orderStatusRes.data || { 
        total_orders: 0, 
        distribution: [] 
      };
      setOrderStatus(orderStatusData);

      // ✅ Top products
      const topProductsData = Array.isArray(topProductsRes.data) 
        ? topProductsRes.data 
        : (topProductsRes.data?.data || []);
      setTopProducts(topProductsData);

      // ✅ Customer growth
      const customerGrowthData = Array.isArray(customerGrowthRes.data)
        ? customerGrowthRes.data
        : (customerGrowthRes.data?.data || []);
      setCustomerGrowth(customerGrowthData);

    } catch (error) {
      console.error("[useDashboard] Error loading branch data:", error);
      message.error("Không thể tải dữ liệu chi nhánh");
    }
  };

  const loadSuperAdminData = async () => {
    console.log("[useDashboard] Loading Super Admin data...");

    try {
      const [revenueRes, orderStatsRes, revenueChartRes] = await Promise.all([
        dashboardApi.getRevenuePerBranch(),
        dashboardApi.getOrderStats(),
        dashboardApi.getRevenueChart("month"),
      ]);

      console.log("[useDashboard] Super Admin data received:", {
        revenue: revenueRes,
        orderStats: orderStatsRes,
        revenueChart: revenueChartRes,
      });

      // ✅ Extract arrays
      const extractArray = (res) => {
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data?.data)) return res.data.data;
        return [];
      };

      setRevenuePerBranch(extractArray(revenueRes));
      setOrderStats(extractArray(orderStatsRes));
      setRevenueChart(extractArray(revenueChartRes));

    } catch (error) {
      console.error("[useDashboard] Error loading super admin data:", error);
      message.error("Không thể tải dữ liệu tổng quan");
    }
  };

  return {
    loading,
    isSuperAdmin,
    isAdmin,
    selectedMonth,
    selectedYear,
    handleMonthChange: setSelectedMonth,
    handleYearChange: setSelectedYear,
    refreshData: loadDashboardData,

    // Branch Admin
    branchStats,
    orderStatus,
    topProducts,
    customerGrowth,

    // Super Admin
    revenuePerBranch,
    orderStats,
    revenueChart,
  };
};