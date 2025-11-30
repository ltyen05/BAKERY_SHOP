// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import ProductsView from "./pages/Products/ProductsView";
import CustomersView from "./pages/Customers/CustomersView";
import DashboardView from "./pages/Dashboard/DashboardView";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/products" element={<ProductsView />} />
          <Route path="/customers" element={<CustomersView />} />

          
         
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
