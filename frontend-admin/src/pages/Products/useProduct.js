// ===============================================
// Location: src/pages/Products/useProduct.js
// ===============================================
import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { productApi } from '../../api/productApi';
import { CATEGORIES, CATEGORY_TABS } from './productConstants';

export const useProduct = () => {
  // ============= STATE =============
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  // ============= FETCH DATA =============
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAllProducts();
      
      console.log('Backend response:', data);
      
      // Backend trả về: { product_id, name, category, unit_price, image, description, rating }
      const mappedProducts = data.map(p => ({
        key: p.product_id,
        id: p.product_id,
        name: p.name || 'Unnamed',
        category: CATEGORIES[p.category] || 'Khác',
        categoryId: p.category,
        price: p.unit_price || 0,  // ← FIX: Backend gửi unit_price
        image: p.image || 'https://via.placeholder.com/100',
        description: p.description || '',
        
        // Dữ liệu gốc để edit
        product_id: p.product_id,
        category_id: p.category,
        unit_price: p.unit_price,  // ← FIX: Đúng field name
        image_url: p.image
      }));
      
      setProducts(mappedProducts);
      console.log('Mapped products:', mappedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      message.error('Không thể tải dữ liệu sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ============= FILTERED DATA =============
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

  // ============= CATEGORY COUNT =============
  const categoryCount = (categoryId) => {
    const tab = CATEGORY_TABS.find(t => t.id === categoryId);
    if (!tab?.categoryId) return products.length;
    return products.filter(p => p.categoryId === tab.categoryId).length;
  };

  // ============= CRUD OPERATIONS =============
  const addProduct = async (formData) => {
    try {
      console.log('Form data from modal:', formData);
      const result = await productApi.addProduct(formData);
      await fetchProducts();
      message.success('Thêm sản phẩm thành công!');
      return { success: true };
    } catch (err) {
      console.error('Add product error:', err);
      message.error('Không thể thêm sản phẩm');
      return { success: false };
    }
  };

  const updateProduct = async (productId, formData) => {
    try {
      console.log('Update form data:', formData);
      const result = await productApi.updateProduct(productId, formData);
      await fetchProducts();
      message.success('Cập nhật sản phẩm thành công!');
      return { success: true };
    } catch (err) {
      console.error('Update product error:', err);
      message.error('Không thể cập nhật sản phẩm');
      return { success: false };
    }
  };

  const deleteProduct = async (productId, productName) => {
    try {
      await productApi.deleteProduct(productId);
      await fetchProducts();
      message.success(`Đã xóa sản phẩm "${productName}"`);
      return { success: true };
    } catch (err) {
      console.error('Delete error:', err);
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

  // ============= EXPORT =============
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

  // ============= RETURN =============
  return {
    // Data
    products,
    filteredData,
    
    // State
    loading,
    activeCategory,
    searchQuery,
    currentPage,
    rowsPerPage,
    
    // CRUD
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Helpers
    categoryCount,
    
    // Handlers
    setCurrentPage,
    handleCategoryChange,
    handleSearchChange,
    handleExportCSV
  };
};