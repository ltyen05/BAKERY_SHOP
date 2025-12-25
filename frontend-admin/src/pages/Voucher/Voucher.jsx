import { useState } from 'react';
import './Voucher.css';
import { 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaTag, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaUsers,
  FaCalendarAlt,
  FaTh,
  FaList,
  FaCrown,
  FaStar,
  FaGem
} from 'react-icons/fa';

const INITIAL_VOUCHERS = [
  {
    id: 1,
    code: 'SUMMER2024',
    name: 'Giảm giá mùa hè',
    discount: 20,
    type: 'percent',
    minOrder: 100000,
    maxDiscount: 50000,
    quantity: 100,
    used: 45,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'Active',
    level: 'Normal'
  },
  {
    id: 2,
    code: 'VIP50K',
    name: 'Ưu đãi VIP',
    discount: 50000,
    type: 'fixed',
    minOrder: 200000,
    maxDiscount: null,
    quantity: 50,
    used: 30,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'Active',
    level: 'VIP'
  },
  {
    id: 3,
    code: 'SILVER30',
    name: 'Silver member',
    discount: 30,
    type: 'percent',
    minOrder: 150000,
    maxDiscount: 80000,
    quantity: 100,
    used: 67,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'Active',
    level: 'Silver'
  },
  {
    id: 4,
    code: 'FLASH50',
    name: 'Flash sale',
    discount: 50,
    type: 'percent',
    minOrder: 0,
    maxDiscount: 100000,
    quantity: 200,
    used: 200,
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    status: 'Expired',
    level: 'Normal'
  }
];

// Component: Stat Card
const StatCard = ({ icon: Icon, label, value, gradient }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: gradient }}>
      <Icon />
    </div>
    <div className="stat-info">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
  </div>
);

// Component: Voucher Card
const VoucherCard = ({ voucher, onDelete }) => {
  const getLevelIcon = () => {
    switch(voucher.level) {
      case 'VIP': return <FaCrown style={{color: '#f59e0b'}} />;
      case 'Silver': return <FaStar style={{color: '#94a3b8'}} />;
      case 'Gold': return <FaGem style={{color: '#eab308'}} />;
      default: return null;
    }
  };

  return (
    <div className={`voucher-card ${voucher.status.toLowerCase()}`}>
      <div className="voucher-header-card">
        <div className="voucher-badge-group">
          <div className="voucher-badge">
            {voucher.status === 'Active' 
              ? <><FaCheckCircle /> Hoạt động</>
              : <><FaTimesCircle /> Hết hạn</>
            }
          </div>
          {voucher.level !== 'Normal' && (
            <div className={`level-badge ${voucher.level.toLowerCase()}`}>
              {getLevelIcon()} {voucher.level}
            </div>
          )}
        </div>
        <div className="voucher-actions">
          <button className="btn-icon" title="Sửa">
            <FaEdit />
          </button>
          <button className="btn-icon" onClick={() => onDelete(voucher.id)} title="Xóa">
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="voucher-code">
        <span className="code-label">Mã:</span>
        <span className="code-value">{voucher.code}</span>
      </div>

      <h3 className="voucher-name">{voucher.name}</h3>

      <div className="voucher-discount">
        {voucher.type === 'percent' 
          ? `Giảm ${voucher.discount}%`
          : `Giảm ${voucher.discount.toLocaleString()}đ`
        }
      </div>

      <div className="voucher-details">
        <div className="detail-item">
          <span className="detail-label">Đơn tối thiểu:</span>
          <span className="detail-value">{voucher.minOrder.toLocaleString()}đ</span>
        </div>
        {voucher.maxDiscount && (
          <div className="detail-item">
            <span className="detail-label">Giảm tối đa:</span>
            <span className="detail-value">{voucher.maxDiscount.toLocaleString()}đ</span>
          </div>
        )}
      </div>

      <div className="voucher-progress">
        <div className="progress-info">
          <span>Đã dùng: {voucher.used}/{voucher.quantity}</span>
          <span>{Math.round((voucher.used / voucher.quantity) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(voucher.used / voucher.quantity) * 100}%` }}
          />
        </div>
      </div>

      <div className="voucher-date">
        <FaCalendarAlt />
        <span>{voucher.startDate} → {voucher.endDate}</span>
      </div>
    </div>
  );
};

// Main Component
export default function Voucher() {
  const [vouchers, setVouchers] = useState(INITIAL_VOUCHERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const filteredVouchers = vouchers.filter(v => {
    const matchSearch = v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       v.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || v.status === filterStatus;
    const matchLevel = filterLevel === 'All' || v.level === filterLevel;
    return matchSearch && matchStatus && matchLevel;
  });

  const stats = {
    total: vouchers.length,
    active: vouchers.filter(v => v.status === 'Active').length,
    expired: vouchers.filter(v => v.status === 'Expired').length,
    used: vouchers.reduce((sum, v) => sum + v.used, 0)
  };

  const handleDeleteVoucher = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa voucher này?')) {
      setVouchers(vouchers.filter(v => v.id !== id));
    }
  };

  return (
    <div className="voucher-page">
      {/* Header */}
      <div className="voucher-header">
        <div className="header-left">
          <h1>Quản lý Voucher</h1>
          <p>Tạo và quản lý các mã giảm giá cho khách hàng</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard 
          icon={FaTag} 
          label="Tổng voucher" 
          value={stats.total}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
        <StatCard 
          icon={FaCheckCircle} 
          label="Đang hoạt động" 
          value={stats.active}
          gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
        />
        <StatCard 
          icon={FaTimesCircle} 
          label="Đã hết hạn" 
          value={stats.expired}
          gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
        />
        <StatCard 
          icon={FaUsers} 
          label="Lượt sử dụng" 
          value={stats.used}
          gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
        />
      </div>

      {/* Toolbar */}
      <div className="voucher-toolbar">
        <div className="toolbar-left">
          <div className="search-box-toolbar">
            <FaSearch />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hoặc tên voucher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add-voucher" onClick={() => setShowModal(true)}>
            <FaPlus />
            Tạo voucher mới
          </button>
        </div>
        <div className="toolbar-right">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FaTh />
            </button>
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="voucher-filters">
        <div className="filter-group">
          <label>Phân loại:</label>
          <div className="filter-tabs">
            {['All', 'VIP', 'Silver', 'Gold', 'Normal'].map(level => (
              <button
                key={level}
                className={`filter-tab ${filterLevel === level ? 'active' : ''}`}
                onClick={() => setFilterLevel(level)}
              >
                {level === 'All' ? 'Tất cả' : level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="vouchers-grid">
          {filteredVouchers.map(voucher => (
            <VoucherCard 
              key={voucher.id} 
              voucher={voucher} 
              onDelete={handleDeleteVoucher}
            />
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="voucher-table-container">
          <table className="voucher-table">
            <thead>
              <tr>
                <th>Mã Voucher</th>
                <th>Tên</th>
                <th>Phân loại</th>
                <th>Giảm giá</th>
                <th>Đơn tối thiểu</th>
                <th>Đã dùng</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.map(voucher => (
                <tr key={voucher.id}>
                  <td><span className="table-code">{voucher.code}</span></td>
                  <td><span className="table-name">{voucher.name}</span></td>
                  <td>
                    <span className={`level-badge-small ${voucher.level.toLowerCase()}`}>
                      {voucher.level}
                    </span>
                  </td>
                  <td>
                    <span className="table-discount">
                      {voucher.type === 'percent' 
                        ? `${voucher.discount}%`
                        : `${voucher.discount.toLocaleString()}đ`
                      }
                    </span>
                  </td>
                  <td>{voucher.minOrder.toLocaleString()}đ</td>
                  <td>
                    <div className="table-progress">
                      <span>{voucher.used}/{voucher.quantity}</span>
                      <div className="mini-progress-bar">
                        <div 
                          className="mini-progress-fill"
                          style={{ width: `${(voucher.used / voucher.quantity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="table-date">
                      <div>{voucher.startDate}</div>
                      <div style={{color: '#9ca3af', fontSize: '12px'}}>{voucher.endDate}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`table-status ${voucher.status.toLowerCase()}`}>
                      {voucher.status === 'Active' 
                        ? <><FaCheckCircle /> Hoạt động</>
                        : <><FaTimesCircle /> Hết hạn</>
                      }
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon"><FaEdit /></button>
                      <button className="btn-icon" onClick={() => handleDeleteVoucher(voucher.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredVouchers.length === 0 && (
        <div className="empty-state">
          <FaTag style={{ fontSize: '64px', color: '#d1d5db' }} />
          <h3>Không tìm thấy voucher</h3>
          <p>Thử thay đổi bộ lọc hoặc tạo voucher mới</p>
        </div>
      )}

      {showModal && (
        <div className="modal-placeholder" onClick={() => setShowModal(false)}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '16px' }} onClick={(e) => e.stopPropagation()}>
            <h2>Thêm Voucher Mới</h2>
            <p>Modal sẽ hoàn thiện sau</p>
            <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', cursor: 'pointer' }}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}