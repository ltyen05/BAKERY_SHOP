import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";

import ProductsView from "./pages/Products/ProductsView";
import CustomersView from "./pages/Customers/CustomersView";
import DashboardView from "./pages/Dashboard/DashboardView";
import OrdersView from "./pages/Orders/OrdersView";
import Employee from "./pages/Employee/Employee";

import FeedbackOverview from "./pages/Feedback/FeedbackOverview";
import FeedbackList from "./pages/Feedback/FeedbackList";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<DashboardView />} />
          <Route path="products" element={<ProductsView />} />
          <Route path="customers" element={<CustomersView />} />
          <Route path="orders" element={<OrdersView />} />
          <Route path="employee" element={<Employee />} />
          <Route path="feedback-overview" element={<FeedbackOverview />} />
          <Route path="feedback-list" element={<FeedbackList />} />

          <Route path="service" element={<div style={{ padding: 20 }}>Service Page</div>} />
          <Route path="promotions" element={<div style={{ padding: 20 }}>Promotions Page</div>} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
