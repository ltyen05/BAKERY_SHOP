// ===============================================
// FILE: src/pages/Branch/branchConstants.js
// Constants for Branch Management - FIXED
// ===============================================
import { FiMapPin, FiPhone, FiMail, FiHome } from 'react-icons/fi';

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
    name: 'email',
    label: 'Email',
    type: 'text',
    inputType: 'email',
    icon: FiMail,
    placeholder: 'VD: hoankiem@husbakery.vn',
    required: true
  },
  {
    name: 'mapSrc',
    label: 'Link Google Maps',
    type: 'text',
    icon: FiMapPin,
    placeholder: 'https://www.google.com/maps/embed?...',
    required: false,
    fullWidth: true
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
  },
  {
    name: 'manager_id',
    label: 'ID Quản lý',
    type: 'text',
    inputType: 'number',
    placeholder: 'VD: 1',
    required: false
  }
];

export const getInitials = (name) => {
  if (!name) return 'BR';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};