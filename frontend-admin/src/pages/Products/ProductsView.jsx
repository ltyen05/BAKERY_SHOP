// ===============================================
// Location:src/pages/Products/ProductsView.jsx 
// ===============================================
import React, { useState, useEffect, useMemo } from 'react';
import { Image, Tag, Space, Button, Modal, message } from 'antd';
import { 
  FiEdit2, FiTrash2, FiDownload, FiSearch, FiPlus, FiPackage, FiTag, FiFileText, FiImage
} from 'react-icons/fi';
import { PiMoney } from 'react-icons/pi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { productApi } from '../../api/productApi';
import DataTable from '../../components/Table/Table';
import FormModal from '../../components/FormModal/FormModal';
import './ProductsView.css';

const { confirm } = Modal;

const CATEGORIES = {
  1: 'Bread',
  2: 'Cookie', 
  3: 'Pastry'
};

const CATEGORY_TABS = [
  { id: 'all', label: 'Tất cả', categoryId: null },
  { id: 'bread', label: 'Bread', categoryId: 1 },
  { id: 'cookie', label: 'Cookie', categoryId: 2 },
  { id: 'pastry', label: 'Pastry', categoryId: 3 }
];

const productFields = [
  {
    name: 'name',
    label: 'Tên sản phẩm',
    type: 'text',
    icon: FiPackage,
    placeholder: 'Nhập tên sản phẩm',
    required: true,
    fullWidth: true
  },
  {
    name: 'category_id',
    label: 'Danh mục',
    type: 'select',
    icon: FiTag,
    required: true,
    defaultValue: 1,
    options: [
      { value: 1, label: 'Bread' },
      { value: 2, label: 'Cookie' },
      { value: 3, label: 'Pastry' }
    ]
  },
  {
    name: 'unit_price',
    label: 'Giá sản phẩm (VNĐ)',
    inputType: 'number',
    icon: PiMoney,
    placeholder: '0',
    required: true,
    transform: (value) => parseFloat(value)
  },
  {
    name: 'image_url',
    label: 'URL hình ảnh',
    type: 'url',
    icon: FiImage,
    placeholder: 'https://example.com/image.jpg',
    fullWidth: true
  },
  {
    name: 'description',
    label: 'Mô tả sản phẩm',
    type: 'textarea',
    icon: FiFileText,
    placeholder: 'Nhập mô tả chi tiết về sản phẩm...',
    fullWidth: true,
    rows: 4
  }
];

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAllProducts();
      
      const mappedProducts = data.map(p => ({
        key: p.product_id,
        id: p.product_id,
        name: p.name || 'Unnamed',
        category: CATEGORIES[p.category_id] || 'Khác',
        categoryId: p.category_id,
        price: p.unit_price || 0,
        image: p.image_url || 'https://via.placeholder.com/100',
        description: p.description || '',
        category_id: p.category_id,
        unit_price: p.unit_price,
        image_url: p.image_url
      }));
      
      setProducts(mappedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      message.error('Không thể tải dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (data) => {
    try {
      await productApi.addProduct(data);
      await fetchProducts();
      setIsAddModalOpen(false);
      message.success('Thêm sản phẩm thành công!');
    } catch (err) {
      message.error('Không thể thêm sản phẩm');
      throw err;
    }
  };

  const handleUpdateProduct = async (productId, data) => {
    try {
      await productApi.updateProduct(productId, data);
      await fetchProducts();
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      message.success('Cập nhật sản phẩm thành công!');
    } catch (err) {
      message.error('Không thể cập nhật sản phẩm');
      throw err;
    }
  };

  const handleDelete = (product) => {
    confirm({
      title: 'Xác nhận xóa sản phẩm',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc muốn xóa sản phẩm "${product.name}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      async onOk() {
        try {
          await productApi.deleteProduct(product.id);
          await fetchProducts();
          message.success('Xóa sản phẩm thành công!');
        } catch (err) {
          message.error('Không thể xóa sản phẩm');
        }
      }
    });
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Tên sản phẩm', 'Danh mục', 'Giá', 'Mô tả'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(product => 
        [product.id, product.name, product.category, product.price, product.description].join(',')
      )
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    message.success('Xuất file CSV thành công!');
  };

  const filteredData = useMemo(() => {
    return products.filter(product => {
      const currentTab = CATEGORY_TABS.find(t => t.id === activeCategory);
      const matchCategory = !currentTab?.categoryId || product.categoryId === currentTab.categoryId;
      
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = query === '' ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.id.toString().includes(query) ||
        product.description.toLowerCase().includes(query);
      
      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const categoryCount = (categoryId) => {
    const tab = CATEGORY_TABS.find(t => t.id === categoryId);
    if (!tab?.categoryId) return products.length;
    return products.filter(p => p.categoryId === tab.categoryId).length;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
      fixed: 'left',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      align: 'center',
      render: (image, record) => (
        <Image
          src={image}
          alt={record.name}
          width={60}
          height={60}
          style={{ 
            borderRadius: '10px', 
            objectFit: 'cover',
            border: '1px solid #e5e7eb'
          }}
          fallback="https://via.placeholder.com/100"
          preview={{
            mask: 'Xem'
          }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <span style={{ fontWeight: 600, color: '#1e293b' }}>{text}</span>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <span style={{ color: '#94a3b8', fontSize: '13px' }}>
          {text || 'Không có mô tả'}
        </span>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 130,
      align: 'center',
      render: (category) => (
        <Tag 
          color={
            category === 'Bread' ? 'gold' : 
            category === 'Cookie' ? 'orange' : 
            'volcano'
          }
          style={{ fontWeight: 600, fontSize: '12px' }}
        >
          {category}
        </Tag>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <span style={{ fontWeight: 600, color: '#10b981', fontSize: '14px' }}>
          {formatCurrency(price)}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<FiEdit2 style={{ color: '#3b82f6' }} />}
            onClick={() => {
              setSelectedProduct(record);
              setIsEditModalOpen(true);
            }}
            title="Chỉnh sửa"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
          <Button
            type="text"
            icon={<FiTrash2 style={{ color: '#ef4444' }} />}
            onClick={() => handleDelete(record)}
            title="Xóa"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </Space>
      ),
    },
  ];

  const paginationConfig = {
    current: currentPage,
    pageSize: rowsPerPage,
    total: filteredData.length,
    onChange: (page) => setCurrentPage(page),
    showSizeChanger: false,
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <h2 className="product-title">Product Management</h2>
        <p className="product-subtitle">Quản lý sản phẩm bánh của cửa hàng</p>
      </div>

      <div className="tabs-action-bar">
        <div className="category-tabs">
          {CATEGORY_TABS.map(tab => (
            <div
              key={tab.id}
              onClick={() => { 
                setActiveCategory(tab.id); 
                setCurrentPage(1); 
              }}
              className={`category-tab ${activeCategory === tab.id ? 'active' : ''}`}
            >
              {tab.label} <span className="tab-count">({categoryCount(tab.id)})</span>
            </div>
          ))}
        </div>
        
        <div className="right-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm theo tên, ID, mô tả..."
              value={searchQuery}
              onChange={(e) => { 
                setSearchQuery(e.target.value); 
                setCurrentPage(1); 
              }}
              className="search-input"
            />
          </div>

          <button onClick={handleExportCSV} className="export-btn">
            <FiDownload /> Export
          </button>

          <button onClick={() => setIsAddModalOpen(true)} className="add-product-btn">
            <FiPlus /> Thêm sản phẩm
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={paginationConfig}
        rowKey="id"
        scroll={{ x: 1200 }}
        emptyText="Không tìm thấy sản phẩm nào"
      />

      <FormModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
        title={{ 
          add: 'Thêm sản phẩm mới',
          addDesc: 'Điền thông tin sản phẩm mới'
        }}
        icon={FiPackage}
        fields={productFields}
      />

      <FormModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleUpdateProduct}
        data={selectedProduct}
        title={{ 
          edit: 'Chỉnh sửa sản phẩm',
          editDesc: 'Cập nhật thông tin sản phẩm'
        }}
        icon={FiPackage}
        fields={productFields}
      />
    </div>
  );
}