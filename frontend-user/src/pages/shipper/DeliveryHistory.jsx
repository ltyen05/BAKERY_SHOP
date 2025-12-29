import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Space,
  Typography,
  Card,
  Modal,
} from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";

const { Title } = Typography;

/* =========================
   MOCK ORDER HISTORY DATA
========================= */
const MOCK_ORDERS = [
  {
    order_id: 231,
    quantities: [1, 2],
    products: ["Bánh mì", "Bánh kem"],
    total_amount: 424000,
    branch_id: "234 Nguyễn Trãi, Thanh Xuân",
    status: "completed",
    rating: 5,
  },
  {
    order_id: 232,
    quantities: [3],
    products: ["Bánh croissant"],
    total_amount: 180000,
    branch_id: "12 Láng Hạ, Đống Đa",
    status: "completed",
    rating: 4,
  },
  {
    order_id: 233,
    quantities: [1, 1, 2],
    products: ["Bánh tiramisu", "Bánh su", "Bánh quy"],
    total_amount: 520000,
    branch_id: "88 Cầu Giấy",
    status: "failed",
    rating: null,
  },
  {
    order_id: 234,
    quantities: [2],
    products: ["Bánh sinh nhật"],
    total_amount: 350000,
    branch_id: "45 Hoàng Quốc Việt",
    status: "completed",
    rating: 5,
  },
];

/* =========================
   STATUS COLOR
========================= */
const STATUS_COLOR = {
  completed: "green",
  failed: "red",
  delivering: "orange",
};

const OrderHistory = () => {
  const [data] = useState(MOCK_ORDERS);
  const [searchText, setSearchText] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [showDetail, setShowDetail] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (_, sorter) => {
    setSortedInfo(sorter);
  };

  const handleShowOrderDetails = (order) => {
    setCurrentOrder(order);
    setShowDetail(true);
  };

  /* =========================
     FILTER
  ========================= */
  const filteredData = data.filter(
    (item) =>
      item.order_id.toString().includes(searchText) ||
      item.products.some((p) =>
        p.toLowerCase().includes(searchText.toLowerCase())
      )
  );

  /* =========================
     TABLE COLUMNS
  ========================= */
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
      dataIndex: "quantities",
      key: "quantities",
      align: "center",
      width: 100,
      render: (quantities) => (
        <Space direction="vertical" size={4}>
          {quantities.map((q, idx) => (
            <div key={idx}>{q}</div>
          ))}
        </Space>
      ),
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
          {total.toLocaleString("vi-VN")} VND
        </span>
      ),
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "branch_id",
      key: "branch_id",
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
          onClick={() => handleShowOrderDetails(record)}
        />
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      align: "center",
      width: 80,
      render: (rating) => (rating ? `⭐ ${rating}` : "--"),
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
            Lịch sử mua hàng
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

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="order_id"
            onChange={handleChange}
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
            bordered
          />
        </div>
      </Card>

      {/* =========================
          ORDER DETAIL MODAL
      ========================= */}
      <Modal
        open={showDetail}
        onCancel={() => setShowDetail(false)}
        footer={null}
        title={`Chi tiết đơn #${currentOrder?.order_id}`}
      >
        {currentOrder && (
          <div>
            <p>
              <b>Sản phẩm:</b> {currentOrder.products.join(", ")}
            </p>
            <p>
              <b>Số lượng:</b> {currentOrder.quantities.join(", ")}
            </p>
            <p>
              <b>Tổng tiền:</b>{" "}
              {currentOrder.total_amount.toLocaleString("vi-VN")} VND
            </p>
            <p>
              <b>Địa chỉ:</b> {currentOrder.branch_id}
            </p>
            <p>
              <b>Trạng thái:</b> {currentOrder.status}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
