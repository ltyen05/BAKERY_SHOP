import React, { useState, useEffect } from "react";
import { Table, Input, Button, Tag, Space, Typography, Card, message } from "antd";
import { SearchOutlined, EyeOutlined, CloseOutlined } from "@ant-design/icons";
import { useAccount } from "../../context/AccountContext";
import { useOrder } from "../../context/OrderContext";
import OrderDetails from "../Order/OrderDetails";

const { Title } = Typography;

const OrderHistory = () => {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const { history_orders } = useAccount();
  const [currentOrder, setCurrentOrder] = useState({});
  const [loadingOrder, setLoadingOrder] = useState(false);
  const { orderDetails } = useOrder();
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);

  // ===== 1. LẤY DỮ LIỆU AN TOÀN =====
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const orders = await history_orders();
        console.log("History Orders:", orders);
        
        // ✅ Code phòng thủ: Nếu orders là null/undefined thì gán mảng rỗng để không lỗi
        if (Array.isArray(orders)) {
          setData(orders);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Lấy lịch sử đơn hàng thất bại:", err.message);
        setData([]); // Gán mảng rỗng khi lỗi API
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [history_orders]);

  const handleShowOrderDetails = async (order_id) => {
    try {
      setLoadingOrder(true);
      const order = await orderDetails(order_id);
      setCurrentOrder(order);
      setShowOrderDetails(true);
    } catch (err) {
      message.error(err.message || "Không thể lấy chi tiết đơn hàng");
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  // ===== 2. CẤU HÌNH CỘT (COLUMNS) AN TOÀN =====
  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      align: "center",
      width: 90,
      fixed: "left",
      sorter: (a, b) => a.order_id - b.order_id,
      sortOrder: sortedInfo.columnKey === "order_id" ? sortedInfo.order : null,
    },
    {
      title: "Sản phẩm",
      dataIndex: "products",
      key: "products",
      align: "center",
      width: 180,
      render: (products) => (
        <Space direction="vertical" size={4}>
          {/* ✅ Code phòng thủ: Kiểm tra mảng trước khi map */}
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product, idx) => (
              <div key={idx} className="text-gray-700">
                {product}
              </div>
            ))
          ) : (
            <span style={{ color: "#999" }}>Không có dữ liệu</span>
          )}
        </Space>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantities",
      key: "quantities",
      align: "center",
      width: 100,
      render: (quantities) => (
        <Space direction="vertical" size={4}>
          {/* ✅ Code phòng thủ */}
          {Array.isArray(quantities) ? (
            quantities.map((quantity, idx) => (
              <div key={idx} className="font-medium">
                {quantity}
              </div>
            ))
          ) : null}
        </Space>
      ),
    },
    {
      title: "Cơ sở",
      dataIndex: "branch_id",
      key: "branch_id",
      align: "center",
      width: 80,
      render: (branch_id) => <span className="font-medium">{branch_id}</span>,
    },
    {
      title: "Giá",
      dataIndex: "prices",
      key: "prices",
      align: "center",
      width: 130,
      render: (prices) => (
        <Space direction="vertical" size={4}>
          {/* ✅ Code phòng thủ */}
          {Array.isArray(prices) ? (
            prices.map((price, idx) => (
              <div key={idx} className="text-orange-600 font-medium">
                {price?.toLocaleString()} đ
              </div>
            ))
          ) : null}
        </Space>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: 110,
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      sortOrder:
        sortedInfo.columnKey === "created_at" ? sortedInfo.order : null,
      render: (date) => date,
    },
    {
      title: "Ngày nhận",
      dataIndex: "received_at",
      key: "received_at",
      align: "center",
      width: 110,
      sorter: (a, b) => new Date(a.received_at) - new Date(b.received_at),
      sortOrder:
        sortedInfo.columnKey === "received_at" ? sortedInfo.order : null,
      render: (date) => date || "-",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      align: "center",
      width: 140,
      sorter: (a, b) => a.total_amount - b.total_amount,
      sortOrder:
        sortedInfo.columnKey === "total_amount" ? sortedInfo.order : null,
      render: (total) => (
        <span className="text-lg font-bold text-orange-600">
          {Number(total).toLocaleString("vi-VN")} VND
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 140,
      render: (status) => (
        <Tag className="px-3 py-1 text-xs font-medium" color={status === 'Hoàn thành' ? 'green' : (status === 'Đã hủy' ? 'red' : 'orange')}>
            {status}
        </Tag>
      ),
    },
    {
      title: "Xem chi tiết",
      key: "action",
      width: 80,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleShowOrderDetails(record.order_id)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  // ===== 3. LỌC DỮ LIỆU AN TOÀN =====
  const filteredData = Array.isArray(data) ? data.filter(
    (item) => {
      const idMatch = item.order_id && item.order_id.toString().includes(searchText);
      const productMatch = Array.isArray(item.products) && item.products.some((p) =>
        p && p.toLowerCase().includes(searchText.toLowerCase())
      );
      return idMatch || productMatch;
    }
  ) : [];

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <div>
        <Card
          className="shadow-xl rounded-2xl overflow-hidden border-0"
          style={{ backgroundColor: "#fdfbf5", border: "none" }}
        >
          <div
            style={{ textAlign: "start" }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6"
          >
            <Title level={2} style={{ color: '#fff', margin: 0 }}>Lịch sử mua hàng</Title>
          </div>

          <div className="mb-6 mt-6 px-6">
            <Input
              placeholder="Nhập orderID hoặc tên bánh ..."
              prefix={<SearchOutlined className="text-gray-400" />}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-80 rounded-lg"
              size="large"
              allowClear
            />
          </div>

          <div className="p-6">
            <Table
              // ✅ QUAN TRỌNG: rowKey giúp tránh lỗi Warning trong Console
              rowKey="order_id"
              loading={loading}
              columns={columns}
              dataSource={filteredData}
              onChange={handleChange}
              pagination={{
                pageSize: 5,
                className: "custom-pagination",
              }}
              scroll={{ x: 1000 }} // Đặt số cụ thể để tránh lỗi scroll
              className="custom-table"
              bordered
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-white" : "bg-orange-50/30"
              }
            />
          </div>
        </Card>
      </div>

      {showOrderDetails && (
        <div className="fl-center showUp" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div
            style={{
              width: "95%",
              maxWidth: "550px",
              backgroundColor: "#fdfbf5",
              height: "90%",
              borderRadius: "8px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              overflow: "hidden"
            }}
          >
             {/* Nút đóng */}
            <button
              onClick={() => setShowOrderDetails(false)}
              style={{ 
                  position: "absolute", top: 10, right: 10, 
                  fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' 
              }}
            >
              <CloseOutlined />
            </button>
            
            {/* Nội dung chi tiết - có thanh cuộn nếu dài */}
            <div style={{ flex: 1, overflowY: "auto", marginTop: "20px" }}>
                 <OrderDetails order={currentOrder} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-table .ant-table-thead > tr > th {
          background: #2e2100 !important;
          color: #fdfbf5 !important;
          font-weight: 600;
        }
        
        .custom-table .ant-table-tbody > tr:hover > td {
          background: #fff8ef !important;
        }
        
        .custom-table .ant-table-column-sorter svg,
        .custom-table .ant-table-filter-trigger {
             color: #fdfbf5 !important;
        }

        .custom-table .ant-table-column-sorter-up.active svg, 
        .custom-table .ant-table-column-sorter-down.active svg,
        .custom-table .ant-table-filter-trigger.active {
          color: #f97316 !important;
        }

        .ant-table-body::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .ant-table-body::-webkit-scrollbar-track {
          background: #fff;
          border-radius: 4px;
        }

        .ant-table-body::-webkit-scrollbar-thumb {
          background: #fb923c;
          border-radius: 4px;
        }

        .ant-table, .ant-table-container, .ant-table-cell {
          border-color: #7a4f2b !important;
        }
      `}</style>
    </div>
  );
};

export default OrderHistory;