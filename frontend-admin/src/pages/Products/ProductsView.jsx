// ===============================================
// FILE: src/pages/Products/ProductsView.jsx
// ===============================================
import React, { useState } from 'react';
import { Tag, Space, Button, Tooltip, Modal, Rate } from 'antd';
import { FiSearch, FiDownload, FiPlus, FiPackage, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DataTable from '../../components/Table/Table';
import FormModal from '../../components/FormModal/FormModal';
import { useProduct } from './useProduct';
import { 
  PRODUCT_FIELDS, 
  PRODUCT_EDIT_FIELDS,
  STATS_CONFIG,
  getCategoryName,
  getCategoryColor
} from './productConstants';
import './ProductsView.css';

const { confirm } = Modal;

const ProductsView = () => {
  const {
    filteredProducts,
    stats,
    loading,
    searchQuery,
    activeCategory,
    currentPage,
    addProduct,
    updateProduct,
    deleteProduct,
    categoryCount,
    getHeaderTitle,
    getHeaderSubtitle,
    setCurrentPage,
    handleSearchChange,
    handleCategoryChange,
    handleExportCSV,
    canManage
  } = useProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setModalMode('edit');
    
    const formData = {
      product_id: product.product_id,
      name: product.name,
      description: product.description,
      image_url: product.image_url || product.image,
      unit_price: product.unit_price,
      category_id: product.category_id
    };
    
    setSelectedProduct(formData);
    setIsModalOpen(true);
  };

  const handleViewClick = (product) => {
    Modal.info({
      title: 'Chi tiết sản phẩm',
      width: 700,
      content: (
        <div style={{ marginTop: 16 }}>
          {product.image_url && (
            <img 
              src={product.image_url} 
              alt={product.name}
              style={{ 
                width: '100%', 
                maxHeight: 300, 
                objectFit: 'cover',
                borderRadius: 8,
                marginBottom: 16
              }}
            />
          )}
          <div style={{ display: 'grid', gap: '12px' }}>
            <p><strong>ID:</strong> {product.product_id}</p>
            <p><strong>Tên sản phẩm:</strong> {product.name}</p>
            <p><strong>Danh mục:</strong> {getCategoryName(product.category_id)}</p>
            <p><strong>Giá bán:</strong> {parseFloat(product.unit_price).toLocaleString('vi-VN')}đ</p>
            <p><strong>Đánh giá:</strong> <Rate disabled value={product.rating || 0} style={{ fontSize: 16 }} /></p>
            <p><strong>Mô tả:</strong></p>
            <div style={{ 
              padding: '12px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              color: '#64748b',
              lineHeight: 1.6
            }}>
              {product.description || 'Chưa có mô tả'}
            </div>
          </div>
        </div>
      )
    });
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
      const productId = selectedProduct.product_id;
      result = await updateProduct(productId, productData);
    }
    
    if (result?.success) {
      handleCloseModal();
    }
  };

  const handleDelete = (product) => {
    if (!canManage) {
      return;
    }

    confirm({
      title: 'Xác nhận xóa sản phẩm',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      async onOk() {
        await deleteProduct(product.product_id, product.name);
      }
    });
  };

  // ============= TABLE COLUMNS =============
  const columns = [
    {
      title: 'ID',
      dataIndex: 'product_id',
      key: 'product_id',
      width: 70,
      align: 'center',
      fixed: 'left',
      render: (id) => (
        <span style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>
          {id}
        </span>
      ),
      sorter: (a, b) => a.product_id - b.product_id
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      width: 260,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={record.image_url || record.image || 'https://via.placeholder.com/50'}
            alt={record.name}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '10px',
              objectFit: 'cover',
              border: '1px solid #f0f0f0',
              flexShrink: 0
            }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ 
              fontWeight: '600', 
              color: '#1e293b', 
              fontSize: '14px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {record.name}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      render: (desc) => (
        <Tooltip title={desc || 'Chưa có mô tả'}>
          <span style={{ 
            fontSize: '13px', 
            color: '#64748b',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {desc || 'Chưa có mô tả'}
          </span>
        </Tooltip>
      )
    },
    {
      title: 'Danh mục',
      dataIndex: 'category_id',
      key: 'category_id',
      width: 120,
      align: 'center',
      render: (categoryId) => (
        <Tag color={getCategoryColor(categoryId)}>
          {getCategoryName(categoryId)}
        </Tag>
      )
    },
    {
      title: 'Giá bán',
      dataIndex: 'unit_price',
      key: 'unit_price',
      width: 130,
      align: 'right',
      render: (price) => (
        <span style={{ fontWeight: '600', color: '#f59e0b', fontSize: '14px' }}>
          {parseFloat(price).toLocaleString('vi-VN')}đ
        </span>
      ),
      sorter: (a, b) => parseFloat(a.unit_price) - parseFloat(b.unit_price)
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: 140,
      align: 'center',
      render: (rating) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Rate 
            disabled 
            value={rating || 0} 
            style={{ fontSize: 14 }}
          />
          <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>
            ({rating ? rating.toFixed(1) : '0.0'})
          </span>
        </div>
      ),
      sorter: (a, b) => (a.rating || 0) - (b.rating || 0)
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          {canManage ? (
            <>
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="text"
                  icon={<FiEdit2 />}
                  onClick={() => handleEditClick(record)}
                  style={{ color: '#3b82f6' }}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  icon={<FiTrash2 />}
                  onClick={() => handleDelete(record)}
                  danger
                />
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                icon={<FiEye />}
                onClick={() => handleViewClick(record)}
                style={{ color: '#6b7280' }}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const paginationConfig = {
    current: currentPage,
    pageSize: 10,
    total: filteredProducts.length,
    showSizeChanger: false,
    showTotal: (total) => `Tổng ${total} sản phẩm`
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="products-title">{getHeaderTitle()}</h1>
        <p className="products-subtitle">{getHeaderSubtitle()}</p>
      </div>

      <div className="tabs-action-bar">
        <div className="category-tabs">
          {STATS_CONFIG.map(tab => (
            <div
              key={tab.key}
              className={`category-tab ${activeCategory === tab.key ? 'active' : ''}`}
              onClick={() => handleCategoryChange(tab.key)}
            >
              <span>{tab.title}</span>
              <span className="tab-count">
                ({tab.key === 'all' ? stats.total : categoryCount(tab.key)})
              </span>
            </div>
          ))}
        </div>

        <div className="right-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm theo tên, danh mục, ID..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <button
            className="export-btn"
            onClick={handleExportCSV}
            disabled={filteredProducts.length === 0 || loading}
          >
            <FiDownload />
            Export
          </button>

          {canManage && (
            <button
              className="add-btn"
              onClick={handleAddClick}
              disabled={loading}
            >
              <FiPlus />
              Thêm sản phẩm
            </button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        dataSource={filteredProducts}
        loading={loading}
        pagination={paginationConfig}
        onChange={handleTableChange}
        rowKey="product_id"
        scroll={{ x: 'max-content' }}
        emptyText="Không có sản phẩm nào"

      />

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveProduct}
        title={{
          add: 'Thêm sản phẩm mới',
          addDesc: 'Điền thông tin sản phẩm vào form bên dưới',
          edit: 'Chỉnh sửa sản phẩm',
          editDesc: 'Cập nhật thông tin sản phẩm'
        }}
        icon={FiPackage}
        data={selectedProduct}
        fields={modalMode === 'edit' ? PRODUCT_EDIT_FIELDS : PRODUCT_FIELDS}
      />
    </div>
  );
};

export default ProductsView;