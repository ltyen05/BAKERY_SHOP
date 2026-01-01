// ===============================================
// Location: src/pages/Branch/branchConstants.js
// ===============================================
import { FiMapPin, FiPhone, FiMail, FiHome, FiUser } from 'react-icons/fi';

export const BRANCH_FIELDS = [
  {
    name: 'name',
    label: 'Tên chi nhánh',
    type: 'text',
    icon: FiHome,
    placeholder: 'VD: HUS Bakery - Hoàn Kiếm',
    required: true
  },
  {
    name: 'address',
    label: 'Địa chỉ',
    type: 'text',
    icon: FiMapPin,
    placeholder: 'VD: 15 Hàng Bạc, Hoàn Kiếm, Hà Nội',
    required: true,
    fullWidth: true
  },
  {
    name: 'phone',
    label: 'Số điện thoại',
    type: 'text',
    icon: FiPhone,
    placeholder: 'VD: 0241234567',
    required: true
  },
  {
    name: 'manager_id',
    label: 'ID Quản lý',
    type: 'text',
    inputType: 'number',
    icon: FiUser,
    placeholder: 'VD: 2',
    required: true, // Required: mandatory for backend processing
    helpText: 'Nhập ID của người quản lý chi nhánh'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    inputType: 'email',
    icon: FiMail,
    placeholder: 'VD: hoankiem@husbakery.vn',
    required: false
  },
  {
    name: 'mapSrc',
    label: 'Link Google Maps Embed',
    type: 'text',
    icon: FiMapPin,
    placeholder: 'https://www.google.com/maps/embed?...',
    required: false,
    fullWidth: true,
    helpText: 'Link iframe embed từ Google Maps'
  },
  {
    name: 'lat',
    label: 'Latitude (Vĩ độ)',
    type: 'text',
    inputType: 'number',
    icon: FiMapPin,
    placeholder: '21.0285',
    required: false
  },
  {
    name: 'lng',
    label: 'Longitude (Kinh độ)',
    type: 'text',
    inputType: 'number',
    icon: FiMapPin,
    placeholder: '105.8542',
    required: false
  }
];

export const getInitials = (name) => {
  if (!name) return 'BR';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};