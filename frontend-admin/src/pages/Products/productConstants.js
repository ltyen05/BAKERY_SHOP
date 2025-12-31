// ===============================================
// Location: src/pages/Products/productConstants.js
// ===============================================
import { 
  FiPackage, 
  FiTag, 
  FiImage,
  FiFileText
} from 'react-icons/fi';
import { PiMoney } from 'react-icons/pi';

// ============= CATEGORIES =============
export const CATEGORIES = {
  1: 'Bread',
  2: 'Cookie', 
  3: 'Pastry'
};

// ============= CATEGORY TABS =============
export const CATEGORY_TABS = [
  { id: 'all', label: 'Tất cả', categoryId: null },
  { id: 'bread', label: 'Bread', categoryId: 1 },
  { id: 'cookie', label: 'Cookie', categoryId: 2 },
  { id: 'pastry', label: 'Pastry', categoryId: 3 }
];

// ============= FORM FIELDS =============
export const PRODUCT_FIELDS = [
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
    type: 'text',
    inputType: 'number',
    icon: PiMoney,
    placeholder: '0',
    required: true,
    transform: (value) => parseFloat(value)
  },
  {
    name: 'image_url',
    label: 'URL hình ảnh',
    type: 'text',
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

// ============= HELPER FUNCTIONS =============
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const getCategoryColor = (category) => {
  switch(category) {
    case 'Bread': return 'gold';
    case 'Cookie': return 'orange';
    case 'Pastry': return 'volcano';
    default: return 'default';
  }
};