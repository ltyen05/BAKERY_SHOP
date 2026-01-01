// ===============================================
// Location: src/pages/Shipper/shipperConstants.js - FIXED
// ===============================================
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiCheckCircle,
  FiLock,
  FiMapPin,
  FiUsers,
  FiUserCheck,
  FiClock,
  FiUserX
} from 'react-icons/fi';

// ============= STATS CONFIG =============
export const STATS_CONFIG = [
  {
    key: 'total',
    title: 'Tổng shipper',
    icon: FiUsers,
    color: 'blue'
  },
  {
    key: 'active',
    title: 'Sẵn sàng',
    icon: FiUserCheck,
    color: 'green'
  },
  {
    key: 'busy',
    title: 'Đang giao',
    icon: FiClock,
    color: 'orange'
  },
  {
    key: 'inactive',
    title: 'Nghỉ việc',
    icon: FiUserX,
    color: 'red'
  }
];

// ============= BRANCHES =============
export const BRANCHES = [
  { value: '1', label: 'HUS Bakery - Hoàn Kiếm', code: 'CN001' },
  { value: '2', label: 'HUS Bakery - Cầu Giấy', code: 'CN002' },
  { value: '3', label: 'HUS Bakery - Đống Đa', code: 'CN003' },
  { value: '4', label: 'HUS Bakery - Hà Đông', code: 'CN004' },
  { value: '5', label: 'HUS Bakery - Thanh Xuân', code: 'CN005' }
];

export const getBranchName = (branchId) => {
  const branch = BRANCHES.find(b => b.value === String(branchId));
  return branch ? branch.label : `Chi nhánh ${branchId}`;
};

// ============= STATUS OPTIONS =============
export const STATUS_OPTIONS = [
  { value: 'Đang hoạt động', label: 'Đang hoạt động' },
  { value: 'Đang giao', label: 'Đang giao' },
  { value: 'Nghỉ việc', label: 'Nghỉ việc' }
];

// ============= FORM FIELDS (BỎ vehicle_type) =============
export const SHIPPER_FIELDS = [
  {
    name: 'shipper_name',
    label: 'Họ và tên',
    type: 'text',
    icon: FiUser,
    placeholder: 'Nguyễn Văn A',
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    inputType: 'email',
    icon: FiMail,
    placeholder: 'example@husbakery.vn',
    required: true
  },
  {
    name: 'phone',
    label: 'Số điện thoại',
    type: 'text',
    icon: FiPhone,
    placeholder: '0901234567',
    required: true
  },
  {
    name: 'password',
    label: 'Mật khẩu',
    type: 'password',
    icon: FiLock,
    placeholder: '••••••••',
    required: true,
    helperText: 'Tối thiểu 6 ký tự',
    showOnEdit: false
  },
  {
    name: 'status',
    label: 'Trạng thái',
    type: 'select',
    icon: FiCheckCircle,
    required: false,
    defaultValue: 'Đang hoạt động',
    options: [
      { value: '', label: 'Chọn trạng thái' },
      ...STATUS_OPTIONS
    ]
  },
  {
    name: 'branch_id',
    label: 'Chi nhánh',
    type: 'select',
    icon: FiMapPin,
    required: true,
    defaultValue: '1',
    options: [
      { value: '', label: 'Chọn chi nhánh' },
      ...BRANCHES
    ],
    transform: (value) => parseInt(value)
  }
];

export const SHIPPER_EDIT_FIELDS = SHIPPER_FIELDS.map(field => {
  if (field.name === 'password') {
    return {
      ...field,
      required: false,
      helperText: 'Để trống nếu không muốn đổi mật khẩu'
    };
  }
  return field;
});

// ============= HELPER FUNCTIONS =============
export const getInitials = (name) => {
  if (!name) return 'NA';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

export const getStatusColor = (status) => {
  switch(status) {
    case 'Đang hoạt động': return 'success';
    case 'Đang giao': return 'warning';
    case 'Nghỉ việc': return 'default';
    default: return 'default';
  }
};