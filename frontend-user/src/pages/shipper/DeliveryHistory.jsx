import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Typography,
  Card,
  Spin,
  Pagination,
  message,
} from "antd";
import { CloseOutlined, SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { useOrder } from "../../context/OrderContext";
import OrderDetails from "../../components/Order/OrderDetails";

const { Title } = Typography;

const STATUS_COLOR = {
  completed: "green",
  failed: "red",
  delivering: "orange",
};

const OrderHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const { orderDetails } = useOrder();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const fetchData = async (page = 1, limit = 5) => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/shipper/statistics/history?page=${page}&limit=${limit}`,
        { method: "GET" }
      );
      const result = await res.json();
      if (result.status === "success") {
        setData(
          result.data.map((item) => ({
            ...item,
            status: item.status === "Đã giao" ? "completed" : "failed",
            // Đảm bảo rating được giữ nguyên từ API, nếu không có thì để null
            rating: item.rating !== undefined ? item.rating : null 
          }))
        );
        setPagination({
          current: page,
          pageSize: limit,
          total: result.pagination.total_records,
        });
      }
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  const handleChange = (_, sorter) => {
    setSortedInfo(sorter);
  };

  const handleShowOrderDetails = async (order_id) => {
    try {
      setLoadingOrder(true);
      const order = await orderDetails(order_id);
      setCurrentOrder(order);
      setShowDetail(true);
    } catch (err) {
      message.error(err.message || "Không thể lấy chi tiết đơn hàng");
    } finally {
      setLoadingOrder(false);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.order_id.toString().includes(searchText) ||
      item.products?.some((p) =>
        p.toLowerCase().includes(searchText.toLowerCase())
      )
  );

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
      title: "Số lượng",
      dataIndex: "quantity_text",
      key: "quantity_text",
      align: "center",
      width: 100,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      align: "center",
      width: 140,
      sorter: (a, b) => a.total_amount - b.total_amount,
      sortOrder: sortedInfo.columnKey === "total_amount" ? sortedInfo.order : null,
      render: (total) => (
        <span className="text-lg font-bold text-orange-600">{total} VND</span>
      ),
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shipping_address",
      key: "shipping_address",
      align: "center",
      width: 200,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 120,
      render: (status) => (
        <Tag color={STATUS_COLOR[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Xem chi tiết",
      key: "action",
      width: 80,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleShowOrderDetails(record.order_id)}
        />
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating", // ✅ Lấy trực tiếp trường rating từ API
      key: "rating",
      align: "center",
      width: 120,
      render: (rating) => {
        // ✅ KIỂM TRA NGHIÊM NGẶT: Chỉ hiện sao nếu rating từ 1-5
        const score = Number(rating);
        if (isNaN(score) || score <= 0) {
          return <span style={{ color: "#bfbfbf" }}>--</span>;
        }
        return (
          <span style={{ color: "#fadb14", fontWeight: "bold" }}>
            ⭐ {score}
          </span>
        );
      },
    },
  ];

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <Card
        className="shadow-xl rounded-2xl overflow-hidden border-0"
        style={{ backgroundColor: "#fdfbf5" }}
      >
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
          <Title level={2} style={{ color: "#fff", margin: 0 }}>
            Lịch sử giao hàng
          </Title>
        </div>

        <div className="p-6">
          <Input
            placeholder="Nhập orderID hoặc tên bánh ..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-80 mb-6"
            size="large"
            allowClear
          />

          {loading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="order_id"
                onChange={handleChange}
                pagination={false}
                scroll={{ x: "max-content" }}
                bordered
              />
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={(page, pageSize) => fetchData(page, pageSize)}
                style={{ marginTop: 16, textAlign: "right" }}
              />
            </>
          )}
        </div>
      </Card>

      {showDetail && (
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
            <button
              onClick={() => setShowDetail(false)}
              style={{ position: "absolute", top: 15, right: 15, fontSize: 15, border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <CloseOutlined />
            </button>
            <div style={{ flex: 1, overflowY: "auto", marginTop: "20px" }}>
              <OrderDetails order={currentOrder} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;