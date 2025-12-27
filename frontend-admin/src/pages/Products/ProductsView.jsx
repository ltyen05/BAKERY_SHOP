import React, { useMemo, useState, useEffect } from 'react';
import { 
  FiEdit2, FiTrash2, FiDownload, FiChevronUp, FiChevronDown,
  FiSearch, FiPlus
} from 'react-icons/fi';
import { productApi } from '../../api/productApi';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import './ProductsView.css';


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

// Component highlight text
const HighlightText = ({ text, highlight }) => {
  if (!highlight || !highlight.trim()) {
    return <span>{text}</span>;
  }
  
  const textStr = String(text);
  const highlightStr = String(highlight).trim();
  
  const escapedHighlight = highlightStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');
  
  const parts = textStr.split(regex);
  
  return (
    <span>
      {parts.map((part, index) => {
        if (part.toLowerCase() === highlightStr.toLowerCase()) {
          return <mark key={index} className="highlight-match">{part}</mark>;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Modal states
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
      setError(null);
      
      const data = await productApi.getAllProducts();
      console.log(' Data from API:', data);
      
      const mappedProducts = data.map(p => ({
        id: p.product_id,
        name: p.name || 'Unnamed',
        category: CATEGORIES[p.category_id] || 'Khác',
        categoryId: p.category_id,
        price: p.unit_price || 0,
        image: p.image_url || 'https://via.placeholder.com/100',
        description: p.description || ''
      }));
      
      console.log(' Mapped products:', mappedProducts);
      setProducts(mappedProducts);
      
    } catch (err) {
      console.error(' Error fetching products:', err);
      setError(`Không thể tải dữ liệu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler thêm sản phẩm
  const handleAddProduct = async (data) => {
    try {
      const result = await productApi.addProduct(data);
      console.log(' Product added:', result);
      
      // Refresh danh sách sản phẩm
      await fetchProducts();
      
      // Đóng modal
      setIsAddModalOpen(false);
      
      alert('Thêm sản phẩm thành công!');
    } catch (err) {
      console.error(' Error adding product:', err);
      alert('Không thể thêm sản phẩm. Vui lòng thử lại.');
    }
  };

  // Handler mở modal edit
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Handler cập nhật sản phẩm
  const handleUpdateProduct = async (productId, data) => {
    try {
      const result = await productApi.updateProduct(productId, data);
      console.log(' Product updated:', result);
      
      // Refresh danh sách sản phẩm
      await fetchProducts();
      
      // Đóng modal
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      
      alert('Cập nhật sản phẩm thành công!');
    } catch (err) {
      console.error(' Error updating product:', err);
      alert('Không thể cập nhật sản phẩm. Vui lòng thử lại.');
    }
  };

  const filteredProducts = useMemo(() => {
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

  const totalPages = Math.ceil(sortedProducts.length / rowsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const categoryCount = (categoryId) => {
    const tab = CATEGORY_TABS.find(t => t.id === categoryId);
    if (!tab?.categoryId) return products.length;
    return products.filter(p => p.categoryId === tab.categoryId).length;
  };

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

  const handleDelete = async (id) => {
    if(!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    try {
      await productApi.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      alert('Xóa sản phẩm thành công!');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Không thể xóa sản phẩm. Vui lòng thử lại.');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Tên sản phẩm', 'Danh mục', 'Giá', 'Mô tả'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(product => 
        [product.id, product.name, product.category, product.price, product.description].join(',')
      )
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products.csv';
    link.click();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  if (loading) {
    return (
      <div className="product-container">
        <div className="loading-state">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-container">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button onClick={fetchProducts} className="retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-container">
      {/* Header */}
      <div className="product-header">
        <h2 className="product-title">Product Management</h2>
        <p className="product-subtitle">
          Quản lý sản phẩm bánh của cửa hàng • Tổng: {products.length} sản phẩm
        </p>
      </div>

      {/* Tabs + Actions */}
      <div className="tabs-action-bar">
        <div className="category-tabs">
          {CATEGORY_TABS.map(tab => (
            <div
              key={tab.id}
              onClick={() => { setActiveCategory(tab.id); setCurrentPage(1); }}
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
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="search-input"
            />
          </div>

          <button onClick={handleExportCSV} className="export-btn">
            <FiDownload />
            Export
          </button>

          <button onClick={() => setIsAddModalOpen(true)} className="add-product-btn">
            <FiPlus />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th className="col-id sortable" onClick={() => handleSort('id')}>
                <div className="th-content">
                  ID {getSortIcon('id')}
                </div>
              </th>
              <th className="col-image">Hình ảnh</th>
              <th className="col-name sortable" onClick={() => handleSort('name')}>
                <div className="th-content">
                  Tên sản phẩm {getSortIcon('name')}
                </div>
              </th>
              <th className="col-desc">Mô tả</th>
              <th className="col-category sortable" onClick={() => handleSort('category')}>
                <div className="th-content">
                  Danh mục {getSortIcon('category')}
                </div>
              </th>
              <th className="col-price sortable" onClick={() => handleSort('price')}>
                <div className="th-content">
                  Giá {getSortIcon('price')}
                </div>
              </th>
              <th className="col-actions">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map(product => (
              <tr key={product.id}>
                <td className="col-id">
                  <HighlightText text={product.id} highlight={searchQuery} />
                </td>
                <td className="col-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                  />
                </td>
                <td className="col-name">
                  <div className="product-name">
                    <HighlightText text={product.name} highlight={searchQuery} />
                  </div>
                </td>
                <td className="col-desc">
                  <div className="product-desc">
                    <HighlightText text={product.description} highlight={searchQuery} />
                  </div>
                </td>
                <td className="col-category">
                  <span className="category-badge">
                    <HighlightText text={product.category} highlight={searchQuery} />
                  </span>
                </td>
                <td className="col-price price-cell">
                  {formatCurrency(product.price)}
                </td>
                <td className="col-actions">
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEditClick(product)}
                      className="icon-btn edit" 
                      title="Chỉnh sửa"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)} 
                      className="icon-btn delete"
                      title="Xóa"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginatedProducts.length === 0 && (
        <div className="empty-state">
          <p>Không tìm thấy sản phẩm nào</p>
        </div>
      )}

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

      {/* Modals */}
      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />

      <EditProductModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleUpdateProduct}
        product={selectedProduct}
      />
    </div>
  );
}