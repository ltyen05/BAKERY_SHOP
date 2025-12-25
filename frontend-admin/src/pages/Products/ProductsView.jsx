import React, { useMemo, useState } from 'react';
import { 
  FiEdit2, FiTrash2, FiPlus, FiDownload, FiChevronUp, FiChevronDown,
  FiPackage, FiDollarSign, FiTrendingUp, FiSearch, FiEye, FiCheckCircle
} from 'react-icons/fi';

import './ProductsView.css';
import StatsCard from '../../components/StatsCard/StatsCard';

// Generate sample products for bakery
const generateProducts = () => {
  const categories = ['Bánh ngọt', 'Bánh mì', 'Bánh kem', 'Bánh quy'];
  const products = [
    {
      id: 1,
      name: 'Bánh Croissant Bơ',
      category: 'Bánh mì',
      price: 25000,
      stock: 45,
      sold: 234,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&h=100&fit=crop',
      description: 'Bánh croissant Pháp giòn tan, thơm bơ'
    },
    {
      id: 2,
      name: 'Bánh Tiramisu',
      category: 'Bánh kem',
      price: 45000,
      stock: 15,
      sold: 189,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=100&h=100&fit=crop',
      description: 'Tiramisu Ý nguyên bản, vị cà phê đậm đà'
    },
    {
      id: 3,
      name: 'Bánh Macaron',
      category: 'Bánh ngọt',
      price: 35000,
      stock: 0,
      sold: 156,
      status: 'Out of Stock',
      image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=100&h=100&fit=crop',
      description: 'Macaron Pháp nhiều màu sắc, vị ngọt dịu'
    },
    {
      id: 4,
      name: 'Bánh Bông Lan Trứng Muối',
      category: 'Bánh ngọt',
      price: 30000,
      stock: 28,
      sold: 312,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1587241321921-91a834d99a2d?w=100&h=100&fit=crop',
      description: 'Bông lan mềm mịn với nhân trứng muối béo ngậy'
    },
    {
      id: 5,
      name: 'Bánh Mì Que',
      category: 'Bánh mì',
      price: 5000,
      stock: 120,
      sold: 567,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop',
      description: 'Bánh mì que giòn rụm, thơm vừng'
    },
  ];

  // Add more products
  const moreProducts = [
    'Bánh Red Velvet', 'Bánh Chocolate', 'Bánh Mousse Dâu',
    'Bánh Eclair', 'Bánh Tart Trái Cây', 'Bánh Cupcake',
    'Bánh Donut', 'Bánh Muffin', 'Bánh Scone',
    'Bánh Cookies Socola', 'Bánh Brownie', 'Bánh Cheese Cake',
    'Bánh Sừng Bò', 'Bánh Baguette', 'Bánh Mì Sandwich'
  ];

  moreProducts.forEach((name, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const price = Math.floor(Math.random() * 50000) + 10000;
    const stock = Math.floor(Math.random() * 100);
    const sold = Math.floor(Math.random() * 500);
    const status = stock > 0 ? 'Available' : 'Out of Stock';
    
    products.push({
      id: products.length + 1,
      name,
      category,
      price,
      stock,
      sold,
      status,
      image: `https://images.unsplash.com/photo-${1509440159596 + i}?w=100&h=100&fit=crop`,
      description: `${name} chất lượng cao, được làm từ nguyên liệu tươi ngon`
    });
  });

  return products;
};

const CATEGORY_TABS = ['Tất cả', 'Bánh ngọt', 'Bánh mì', 'Bánh kem', 'Bánh quy'];

export default function Product() {
  const [products, setProducts] = useState(generateProducts());
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const rowsPerPage = 10;

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Stats
  const stats = useMemo(() => {
    const total = products.length;
    const available = products.filter(p => p.status === 'Available').length;
    const outOfStock = products.filter(p => p.status === 'Out of Stock').length;
    const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sold), 0);
    const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
    
    return { total, available, outOfStock, totalRevenue, totalSold };
  }, [products]);

  // Filtered data
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchCategory = activeCategory === 'Tất cả' || product.category === activeCategory;
      const matchStatus = statusFilter === 'all' || product.status === statusFilter;
      const matchSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchCategory && matchStatus && matchSearch;
    });
  }, [products, activeCategory, statusFilter, searchQuery]);

  // Sort
  const sortedProducts = useMemo(() => {
    if (!sortConfig.key) return filteredProducts;
    
    return [...filteredProducts].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / rowsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const categoryCount = category =>
    category === 'Tất cả'
      ? products.length
      : products.filter(p => p.category === category).length;

  const handlePageChange = (page) => {
    if(page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Add product
  const handleAddProduct = (newProduct) => {
    const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
    setProducts(prev => [...prev, { 
      ...newProduct, 
      id: maxId + 1,
      sold: 0,
      status: newProduct.stock > 0 ? 'Available' : 'Out of Stock'
    }]);
    setIsAddModalOpen(false);
  };

  // Edit product
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setIsEditModalOpen(false);
  };

  // Delete product
  const handleDelete = (id) => {
    if(window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Tên sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Đã bán', 'Trạng thái'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(product => 
        [product.id, product.name, product.category, product.price, product.stock, product.sold, product.status].join(',')
      )
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products.csv';
    link.click();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <div className="product-container">
      {/* Header */}
      <div className="product-header">
        <div>
          <h2 className="product-title">Product Management</h2>
          <p className="product-subtitle">Quản lý sản phẩm bánh của cửa hàng</p>
        </div>
      </div>

      {/* Stats Cards - UPDATED TO USE STATSCARD COMPONENT */}
      <div className="stats-grid">
        <StatsCard 
          title="TỔNG SẢN PHẨM"
          value={stats.total.toString()}
          change={0}
          period=""
          color="purple"
          icon={<FiPackage />}
        />
        
        <StatsCard 
          title="CÒN HÀNG"
          value={stats.available.toString()}
          change={0}
          period=""
          color="green"
          icon={<FiCheckCircle />}
        />
        
        <StatsCard 
          title="ĐÃ BÁN"
          value={stats.totalSold.toString()}
          change={0}
          period=""
          color="orange"
          icon={<FiTrendingUp />}
        />

        <StatsCard 
          title="DOANH THU"
          value={formatCurrency(stats.totalRevenue).replace('₫', 'đ')}
          change={0}
          period=""
          color="pink"
          icon={<FiDollarSign />}
        />
      </div>

      {/* Tabs + Actions Bar */}
      <div className="tabs-action-bar">
        <div className="category-tabs">
          {CATEGORY_TABS.map(category => (
            <div
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => { setActiveCategory(category); setCurrentPage(1); }}
            >
              {category} <span className="tab-count">({categoryCount(category)})</span>
            </div>
          ))}
        </div>
        
        <div className="right-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="search-input"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="status-select"
          >
            <option value="all">Tất cả</option>
            <option value="Available">Còn hàng</option>
            <option value="Out of Stock">Hết hàng</option>
          </select>

          <button className="export-btn" onClick={handleExportCSV}>
            <FiDownload />
            Export
          </button>

          <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
            <FiPlus />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Table Container with Scroll */}
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">
                <div className="th-content">
                  ID {getSortIcon('id')}
                </div>
              </th>
              <th>Hình ảnh</th>
              <th onClick={() => handleSort('name')} className="sortable">
                <div className="th-content">
                  Tên sản phẩm {getSortIcon('name')}
                </div>
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                <div className="th-content">
                  Danh mục {getSortIcon('category')}
                </div>
              </th>
              <th onClick={() => handleSort('price')} className="sortable">
                <div className="th-content">
                  Giá {getSortIcon('price')}
                </div>
              </th>
              <th onClick={() => handleSort('stock')} className="sortable">
                <div className="th-content">
                  Tồn kho {getSortIcon('stock')}
                </div>
              </th>
              <th onClick={() => handleSort('sold')} className="sortable">
                <div className="th-content">
                  Đã bán {getSortIcon('sold')}
                </div>
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                <div className="th-content">
                  Trạng thái {getSortIcon('status')}
                </div>
              </th>
              <th className="action-col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <div className="product-image-cell">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="product-image"
                    />
                  </div>
                </td>
                <td>
                  <div className="product-name-cell">
                    <span className="product-name">{product.name}</span>
                    <span className="product-desc">{product.description}</span>
                  </div>
                </td>
                <td>
                  <span className="category-badge">{product.category}</span>
                </td>
                <td className="price-cell">{formatCurrency(product.price)}</td>
                <td>
                  <span className={`stock-badge ${product.stock <= 10 ? 'low-stock' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="sold-cell">{product.sold}</td>
                <td>
                  <span className={`status ${product.status === 'Available' ? 'available' : 'out-of-stock'}`}>
                    {product.status === 'Available' ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn view" title="Xem chi tiết">
                      <FiEye />
                    </button>
                    <button className="icon-btn edit" onClick={() => handleEditClick(product)} title="Chỉnh sửa">
                      <FiEdit2 />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(product.id)} title="Xóa">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Prev
          </button>
          
          {Array.from({length: totalPages}, (_, i) => i + 1).map(page => {
            if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="pagination-ellipsis">...</span>;
            }
            return null;
          })}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
          
          <span className="pagination-info">
            Trang {currentPage} / {totalPages} • {sortedProducts.length} kết quả
          </span>
        </div>
      )}
    </div>
  );
}