// ===============================================
// FILE: src/pages/Products/useProduct.js
// ✅ FIXED: Thêm logic canManage và header helpers
// ===============================================
import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { productApi } from '../../api/productApi';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES, CATEGORY_TABS } from './productConstants';

export const useProduct = () => {
  const { isSuperAdmin, isViewingBranch } = useAuth();
  
  // ============= STATE =============
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  // ============= QUYỀN HẠN =============
  const canManage = isSuperAdmin && !isViewingBranch;

  // ============= FETCH DATA =============
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 [useProduct] Fetching products from API...');
      
      const productsArray = await productApi.getAllProducts();
      
      console.log(' [useProduct] Raw API response:', productsArray);
      
      // Transform để hiển thị UI
      const mappedProducts = productsArray.map(p => ({
        key: p.product_id,
        id: p.product_id,
        name: p.name || 'Unnamed',
        category: CATEGORIES[p.category_id] || 'Khác',
        categoryId: p.category_id,
        price: p.unit_price || 0,
        image: p.image_url || p.image || 'https://via.placeholder.com/100',
        description: p.description || '',
        rating: p.rating || 0,
        
        // Raw data
        product_id: p.product_id,
        category_id: p.category_id,
        unit_price: p.unit_price,
        image_url: p.image_url || p.image,
        
      }));
      
      console.log(' [useProduct] Mapped products:', mappedProducts);
      setProducts(mappedProducts);
      
    } catch (err) {
      console.error(' [useProduct] Error:', err);
      message.error('Không thể tải dữ liệu sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ============= STATS =============
  const stats = useMemo(() => {
    return {
      total: products.length,
      bread: products.filter(p => p.categoryId === 1).length,
      cookie: products.filter(p => p.categoryId === 2).length,
      pastry: products.filter(p => p.categoryId === 3).length
    };
  }, [products]);

  // ============= FILTERED DATA =============
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filter by category
      const currentTab = CATEGORY_TABS.find(t => t.id === activeCategory);
      const matchCategory = !currentTab?.categoryId || product.categoryId === currentTab.categoryId;
      
      // Filter by search
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = query === '' ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.id.toString().includes(query) ||
        product.description.toLowerCase().includes(query);
      
      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // ============= CATEGORY COUNT =============
  const categoryCount = (categoryId) => {
    const tab = CATEGORY_TABS.find(t => t.id === categoryId);
    if (!tab?.categoryId) return products.length;
    return products.filter(p => p.categoryId === tab.categoryId).length;
  };

  // ============= CRUD OPERATIONS =============
  
  const addProduct = async (formData) => {
    try {
      console.log('➕ [useProduct] Adding product:', formData);
      
      const result = await productApi.addProduct(formData);
      
      if (result.success) {
        message.success(' Thêm sản phẩm thành công!');
        await fetchProducts();
        return { success: true };
      } else {
        message.error(result.message || 'Không thể thêm sản phẩm');
        return { success: false };
      }
      
    } catch (err) {
      console.error(' [useProduct] Add error:', err);
      message.error('Không thể thêm sản phẩm');
      return { success: false };
    }
  };

  const updateProduct = async (productId, formData) => {
    try {
      console.log('✏️ [useProduct] Updating product:', productId, formData);
      
      const result = await productApi.updateProduct(productId, formData);
      
      if (result.success) {
        message.success(' Cập nhật sản phẩm thành công!');
        await fetchProducts();
        return { success: true };
      } else {
        message.error(result.message || 'Không thể cập nhật sản phẩm');
        return { success: false };
      }
      
    } catch (err) {
      console.error(' [useProduct] Update error:', err);
      message.error('Không thể cập nhật sản phẩm');
      return { success: false };
    }
  };

  const deleteProduct = async (productId, productName) => {
    try {
      console.log(' [useProduct] Deleting product:', productId);
      
      const result = await productApi.deleteProduct(productId);
      
      if (result.success) {
        message.success(` Đã xóa sản phẩm "${productName}"`);
        await fetchProducts();
        return { success: true };
      } else {
        message.error(result.message || 'Không thể xóa sản phẩm');
        return { success: false };
      }
      
    } catch (err) {
      console.error(' [useProduct] Delete error:', err);
      message.error('Không thể xóa sản phẩm');
      return { success: false };
    }
  };

  // ============= HANDLERS =============
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // ============= HEADER HELPERS =============
  const getHeaderTitle = () => {
    if (canManage) {
      return 'Quản lý Sản phẩm';
    }
    return 'Danh sách Sản phẩm';
  };

  const getHeaderSubtitle = () => {
    if (canManage) {
      return `Quản lý thông tin sản phẩm của cửa hàng`;
    }
  };

  // ============= EXPORT CSV =============
  const handleExportCSV = () => {
    const headers = ['ID', 'Tên sản phẩm', 'Danh mục', 'Giá', 'Mô tả'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(product => 
        [
          product.id, 
          `"${product.name}"`, 
          product.category, 
          product.price, 
          `"${product.description}"`
        ].join(',')
      )
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    message.success(' Xuất file CSV thành công!');
  };

  // ============= RETURN =============
  return {
    products,
    filteredProducts,
    stats,
    loading,
    activeCategory,
    searchQuery,
    currentPage,
    rowsPerPage,
    canManage,
    addProduct,
    updateProduct,
    deleteProduct,
    categoryCount,
    getHeaderTitle,
    getHeaderSubtitle,
    setCurrentPage,
    handleCategoryChange,
    handleSearchChange,
    handleExportCSV
  };
};