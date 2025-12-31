// ===============================================
// Location: src/pages/Products/ProductsView.jsx - REFACTORED
// ===============================================
import React, { useState } from 'react';
import { Image, Tag, Space, Button, Modal } from 'antd';
import { 
  FiEdit2, FiTrash2, FiDownload, FiSearch, FiPlus, FiPackage
} from 'react-icons/fi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DataTable from '../../components/Table/Table';
import FormModal from '../../components/FormModal/FormModal';
import { useProduct } from './useProduct';
import { 
  CATEGORY_TABS, 
  PRODUCT_FIELDS,
  formatCurrency,
  getCategoryColor
} from './productConstants';
import './ProductsView.css';

const { confirm } = Modal;

const Product = () => {
  // ============= CUSTOM HOOK =============
  const {
    filteredData,
    loading,
    activeCategory,
    searchQuery,
    currentPage,
    rowsPerPage,
    addProduct,
    updateProduct,
    deleteProduct,
    categoryCount,
    setCurrentPage,
    handleCategoryChange,
    handleSearchChange,
    handleExportCSV
  } = useProduct();

  // ============= MODAL STATE =============
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ============= MODAL HANDLERS =============
  const handleAddClick = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (productData) => {
    let result;
    
    if (modalMode === 'add') {
      result = await addProduct(productData);
    } else {
      result = await updateProduct(selectedProduct.id, productData);
    }
    
    if (result?.success) {
      handleCloseModal();
    }
  };

  // ============= DELETE HANDLER =============
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
        await deleteProduct(product.id, product.name);
      }
    });
  };

  // ============= TABLE COLUMNS =============
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
          color={getCategoryColor(category)}
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
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<FiEdit2 style={{ color: '#3b82f6' }} />}
            onClick={() => handleEditClick(record)}
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

  // ============= PAGINATION CONFIG =============
  const paginationConfig = {
    current: currentPage,
    pageSize: rowsPerPage,
    total: filteredData.length,
    onChange: (page) => setCurrentPage(page),
    showSizeChanger: false,
  };

  // ============= RENDER =============
  return (
    <div className="product-container">
      {/* HEADER */}
      <div className="product-header">
        <h2 className="product-title">Product Management</h2>
        <p className="product-subtitle">Quản lý sản phẩm bánh của cửa hàng</p>
      </div>

      {/* TABS + ACTIONS */}
      <div className="tabs-action-bar">
        <div className="category-tabs">
          {CATEGORY_TABS.map(tab => (
            <div
              key={tab.id}
              onClick={() => handleCategoryChange(tab.id)}
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
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-input"
            />
          </div>

          <button onClick={handleExportCSV} className="export-btn">
            <FiDownload /> Export
          </button>

          <button onClick={handleAddClick} className="add-product-btn">
            <FiPlus /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={paginationConfig}
        rowKey="id"
        scroll={{ x: 1200 }}
        emptyText="Không tìm thấy sản phẩm nào"
      />

      {/* FORM MODAL */}
      <FormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveProduct}
        data={selectedProduct}
        title={{ 
          add: 'Thêm sản phẩm mới',
          addDesc: 'Điền thông tin sản phẩm mới',
          edit: 'Chỉnh sửa sản phẩm',
          editDesc: 'Cập nhật thông tin sản phẩm'
        }}
        icon={FiPackage}
        fields={PRODUCT_FIELDS}
      />
    </div>
  );
};

export default Product;