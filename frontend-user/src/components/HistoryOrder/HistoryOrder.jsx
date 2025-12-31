import React, { useState, useEffect } from "react";
import { Table, Input, Button, Tag, Space, Typography, Card } from "antd";
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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const orders = await history_orders();
        console.log(orders); // gọi API từ context
        setData(orders);
      } catch (err) {
        console.error("Lấy lịch sử đơn hàng thất bại:", err.message);
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
  // Sample data with 20 different orders

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

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
          {products.map((product, idx) => (
            <div key={idx} className="text-gray-700">
              {product}
            </div>
          ))}
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
          {quantities.map((quantity, idx) => (
            <div key={idx} className="font-medium">
              {quantity}
            </div>
          ))}
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
          {prices.map((price, idx) => (
            <div key={idx} className="text-orange-600 font-medium">
              {price} đ
            </div>
          ))}
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
        sortedInfo.columnKey === "created_date" ? sortedInfo.order : null,
      render: (date) => date,
    },
    {
      title: "Ngày nhận",
      dataIndex: "received_at",
      key: "received_at",
      align: "center",
      width: 110,
      sorter: (a, b) => new Date(a.receiveDate) - new Date(b.receiveDate),
      sortOrder:
        sortedInfo.columnKey === "received_at" ? sortedInfo.order : null,
      render: (date) => date,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      align: "center",
      width: 140,
      sorter: (a, b) => a.total - b.total,
      sortOrder:
        sortedInfo.columnKey === "total_amount" ? sortedInfo.order : null,
      render: (total) => (
        <span className="text-lg font-bold text-orange-600">
          {total.toLocaleString("vi-VN")} VND
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 140,
      // filters: [
      //   { text: "Hoàn thành", value: "completed" },
      //   { text: "Không thành công", value: "failed" },
      // ],
      // filteredValue: filteredInfo.status || null,
      // onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag className="px-3 py-1 text-xs font-medium">{status}</Tag>
      ),
    },
    {
      title: "Xem chi tiết",
      key: "action",
      width: 60,
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

  const filteredData = data.filter(
    (item) =>
      item.order_id.toString().includes(searchText) ||
      item.products.some((p) =>
        p.toLowerCase().includes(searchText.toLowerCase())
      )
  );

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
            <Title level={2}>Lịch sử mua hàng</Title>
          </div>

          <div className="mb-6 mt-3">
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
              columns={columns}
              dataSource={filteredData}
              onChange={handleChange}
              pagination={{
                pageSize: 4,
                className: "custom-pagination",
              }}
              scroll={{ x: "max-content" }}
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
        <div className="fl-center showUp">
          <div
            style={{
              width: "95%",
              maxWidth: "550px",
              backgroundColor: "#fdfbf5",
              height: "90%",
              borderRadius: "8px",
              flexDirection: "column",
              position: "relative",
            }}
            className="fl-center"
          >
            <OrderDetails order={currentOrder} />
            <button
              onClick={() => setShowOrderDetails(false)}
              style={{ position: "absolute", top: 15, right: 15, fontSize: 15 }}
              className="out-line"
            >
              <CloseOutlined />
            </button>
          </div>
        </div>
      )}
      <style>{`
        .custom-table .ant-table-thead > tr > th {
          background:  #2e2100;
          color:   #fdfbf5;
          font-weight: 600;
        }
        
        .custom-table .ant-table-tbody > tr:hover > td {
          background: #fff8efff !important;
        }
        .custom-table .ant-table-tbody > tr > td {
          background: #fdfbf5 !important;
        }
    
        
        }
        .custom-table .ant-table-column-has-sorters.ant-table-column-sort, .custom-table .ant-table-column-has-sorters:hover {
            background: #fdfbf5 !important;
            color: #2e2100;
        }
        .custom-table .ant-table-filter-trigger:focus,
        .custom-table .ant-table-column-sorter:focus {
              outline: none !important;
              background:red !important;
              box-shadow: none !important;
        }

        .custom-table .ant-table-column-sorter svg
         ,.custom-table .ant-table-filter-trigger {
              color:#fdfbf5!important;  /* màu nâu nhạt hoặc bạn muốn */
          }

/* Sort tăng */
.custom-table .ant-table-column-sorter-up.active svg , 
.custom-table .ant-table-filter-trigger.active {
  color: #f97316 !important;  /* cam */

}

/* Sort giảm */
.custom-table .ant-table-column-sorter-down.active svg {
  color: #f97316 !important;  /* cam */
}

          

        .ant-table-wrapper {
          overflow: hidden;
        }

        .ant-table-body {
          overflow-x: auto !important;
          overflow-y: auto !important;
        }

        .ant-table-body::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .ant-table-body::-webkit-scrollbar-track {
          background: #ffffffff;
          border-radius: 4px;
        }

        .ant-table-body::-webkit-scrollbar-thumb {
          background: #fb923c;
          border-radius: 4px;
        }

        .ant-table-body::-webkit-scrollbar-thumb:hover {
          background: #f97316;
        }
          .ant-table,
.ant-table-container,
.ant-table-cell {
  border-color: #7a4f2b !important; /* màu bạn muốn */
}


      `}</style>
    </div>
  );
};

export default OrderHistory;
