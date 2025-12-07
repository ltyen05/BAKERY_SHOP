import React, { useState } from "react";
import { Table, Input, Button, Tag, Space, Typography, Card } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";

const { Title } = Typography;

const OrderHistory = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  // Sample data with 20 different orders
  const productsList = [
    { name: "Bánh mousse dừa", price: 300000 },
    { name: "Bánh Red Velvet", price: 350000 },
    { name: "Bánh Tiramisu", price: 400000 },
    { name: "Bánh Chocolate", price: 320000 },
    { name: "Bánh Matcha", price: 380000 },
    { name: "Bánh Cheesecake", price: 420000 },
    { name: "Bánh Oreo", price: 360000 },
    { name: "Bánh Strawberry", price: 390000 },
    { name: "Bánh Caramel", price: 340000 },
    { name: "Bánh Black Forest", price: 410000 },
  ];

  const [data] = useState(() => {
    return Array(10)
      .fill(null)
      .map((_, idx) => {
        const numProducts = Math.floor(Math.random() * 3) + 1;
        const products = [];
        const usedProducts = new Set();

        for (let i = 0; i < numProducts; i++) {
          let productIndex;
          do {
            productIndex = Math.floor(Math.random() * productsList.length);
          } while (usedProducts.has(productIndex));

          usedProducts.add(productIndex);
          const product = productsList[productIndex];
          const quantity = Math.floor(Math.random() * 4) + 1;
          products.push({
            name: product.name,
            quantity: quantity,
            price: product.price,
          });
        }

        const total = products.reduce(
          (sum, p) => sum + p.price * p.quantity,
          0
        );
        const orderDate = new Date(
          2024,
          11,
          Math.floor(Math.random() * 15) + 1
        );
        const receiveDate = new Date(
          orderDate.getTime() +
            (Math.floor(Math.random() * 5) + 1) * 24 * 60 * 60 * 1000
        );

        return {
          key: idx,
          orderId: 231 + idx,
          products,
          orderCount: Math.floor(Math.random() * 3) + 1,
          orderDate: orderDate,
          receiveDate: receiveDate,
          total,
          status: Math.random() > 0.8 ? "failed" : "completed",
        };
      });
  });

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
      width: 90,
      fixed: "left",
      sorter: (a, b) => a.orderId - b.orderId,
      sortOrder: sortedInfo.columnKey === "orderId" ? sortedInfo.order : null,
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
              {product.name}
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "products",
      key: "quantities",
      align: "center",
      width: 100,
      render: (products) => (
        <Space direction="vertical" size={4}>
          {products.map((product, idx) => (
            <div key={idx} className="font-medium">
              {product.quantity}
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: "Cơ sở",
      dataIndex: "orderCount",
      key: "orderCount",
      align: "center",
      width: 80,
      render: (count) => <span className="font-medium">{count}</span>,
    },
    {
      title: "Giá",
      dataIndex: "products",
      key: "prices",
      align: "center",
      width: 130,
      render: (products) => (
        <Space direction="vertical" size={4}>
          {products.map((product, idx) => (
            <div key={idx} className="text-orange-600 font-medium">
              {product.price.toLocaleString("vi-VN")} VND
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      align: "center",
      width: 110,
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
      sortOrder: sortedInfo.columnKey === "orderDate" ? sortedInfo.order : null,
      render: (date) => date.toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày nhận",
      dataIndex: "receiveDate",
      key: "receiveDate",
      align: "center",
      width: 110,
      sorter: (a, b) => new Date(a.receiveDate) - new Date(b.receiveDate),
      sortOrder:
        sortedInfo.columnKey === "receiveDate" ? sortedInfo.order : null,
      render: (date) => date.toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "center",
      width: 140,
      sorter: (a, b) => a.total - b.total,
      sortOrder: sortedInfo.columnKey === "total" ? sortedInfo.order : null,
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
      filters: [
        { text: "Hoàn thành", value: "completed" },
        { text: "Không thành công", value: "failed" },
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag
          color={status === "completed" ? "success" : "error"}
          className="px-3 py-1 text-xs font-medium"
        >
          {status === "completed" ? "Hoàn thành" : "Không thành công"}
        </Tag>
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
            size="small"
          />
        </Space>
      ),
    },
  ];

  const filteredData = data.filter(
    (item) =>
      item.orderId.toString().includes(searchText) ||
      item.products.some((p) =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
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
                pageSize: 6,
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
    
        .custom-pagination .ant-pagination-item-active {
          background: #f97316;
          border-color: #f97316;
        }

        .custom-pagination .ant-pagination-item-active a {
          color: white;
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

          

/* 2) Xoá hover nền xanh cho các nút (nếu muốn) */
.custom-pagination .ant-pagination-item a:hover,
.custom-pagination .ant-pagination-item:hover {
  background:  #ffd3b3ff !important;
  color: black !important;
  border-color: transparent !important;
  box-shadow: none !important;
}


/* 4) Nếu muốn active vẫn có màu theme (ví dụ cam) thay vì xanh, đặt ở đây */
.custom-pagination .ant-pagination-item-active a {
  /* thay màu theo ý bạn, hoặc để transparent như trên */
  
  border-color: #f97316 !important;
}
.custom-pagination .ant-pagination-item-active a {
  color: black !important;
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
