import React, { useMemo, useState } from 'react';
import { FiStar, FiSearch, FiEye, FiTrash2, FiGrid, FiList, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import './Feedback.css';

// Generate sample data
const generateReviews = () => {
  const products = ['Croissant Bơ', 'Bánh Mì Pháp', 'Tiramisu', 'Chocolate Cake', 'Red Velvet', 'Macaron'];
  const customers = [
    { name: 'Nguyễn Văn A', email: 'vana@gmail.com' },
    { name: 'Trần Thị B', email: 'thib@gmail.com' },
    { name: 'Lê Hoàng C', email: 'hoangc@gmail.com' },
    { name: 'Phạm Minh D', email: 'minhd@gmail.com' }
  ];
  const comments = [
    'Rất ngon và tươi mới!',
    'Bánh hơi ngọt nhưng khá ổn',
    'Chất lượng tuyệt vời',
    'Giá cả hợp lý',
    'Bánh đẹp mắt và thơm ngon',
    'Tuyệt vời! Bánh rất mềm'
  ];

  return Array.from({ length: 30 }, (_, i) => ({
    id: 1000 + i,
    productName: products[Math.floor(Math.random() * products.length)],
    customerName: customers[Math.floor(Math.random() * customers.length)].name,
    customerEmail: customers[Math.floor(Math.random() * customers.length)].email,
    rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
    comment: comments[Math.floor(Math.random() * comments.length)],
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    status: Math.random() > 0.2 ? 'published' : 'pending'
  })).sort((a, b) => new Date(b.date) - new Date(a.date));
};

const RATING_TABS = ['All', '5⭐', '4⭐', '3⭐', '2⭐', '1⭐'];

export default function Feedback() {
  const [reviews, setReviews] = useState(generateReviews());
  const [activeRating, setActiveRating] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const rowsPerPage = 10;

  // Stats
  const stats = useMemo(() => {
    const total = reviews.length;
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);
    const distribution = [5, 4, 3, 2, 1].map(star => 
      reviews.filter(r => r.rating === star).length
    );
    return { total, avgRating, distribution };
  }, [reviews]);

  // Filtered & Sorted
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchRating = activeRating === 'All' || r.rating === parseInt(activeRating);
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchSearch = !searchQuery || 
        r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRating && matchStatus && matchSearch;
    });
  }, [reviews, activeRating, statusFilter, searchQuery]);

  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      return sortConfig.direction === 'asc' ? aVal > bVal ? 1 : -1 : aVal < bVal ? 1 : -1;
    });
  }, [filteredReviews, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / rowsPerPage);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const ratingCount = (rating) => 
    rating === 'All' ? reviews.length : reviews.filter(r => r.rating === parseInt(rating)).length;

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this review?')) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  const renderStars = (rating) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <FiStar key={star} className={star <= rating ? 'star-filled' : 'star-empty'} />
      ))}
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="feedback-container">
      {/* Header */}
      <div className="feedback-header">
        <h2 className="feedback-title">Review Management</h2>
        <p className="feedback-subtitle">Quản lý đánh giá & phản hồi khách hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="rating-card">
          <h3 className="card-title">Overall Rating</h3>
          <div className="rating-display">
            <div className="rating-number">{stats.avgRating}</div>
            <div className="rating-stars-large">{renderStars(Math.round(stats.avgRating))}</div>
            <div className="rating-count">{stats.total} reviews</div>
          </div>
          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map((star, i) => {
              const count = stats.distribution[i];
              const percentage = (count / stats.total * 100) || 0;
              return (
                <div key={star} className="rating-bar-item">
                  <span className="rating-label">{star}★</span>
                  <div className="rating-bar">
                    <div className="rating-bar-fill" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="rating-value">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stat-card stat-published">
          <h4>Published</h4>
          <div className="stat-number">{reviews.filter(r => r.status === 'published').length}</div>
          <p>Reviews approved</p>
        </div>

        <div className="stat-card stat-pending">
          <h4>Pending</h4>
          <div className="stat-number">{reviews.filter(r => r.status === 'pending').length}</div>
          <p>Waiting for approval</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="rating-tabs">
          {RATING_TABS.map(rating => (
            <div
              key={rating}
              className={`rating-tab ${activeRating === rating ? 'active' : ''}`}
              onClick={() => { setActiveRating(rating); setCurrentPage(1); }}
            >
              {rating} <span className="tab-count">({ratingCount(rating)})</span>
            </div>
          ))}
        </div>

        <div className="right-filters">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="search-input"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="status-select"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
          </select>

          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              <FiList />
            </button>
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
              <FiGrid />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="table-container">
          <table className="feedback-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('productName')} className="sortable">
                  <div className="th-content">Product {getSortIcon('productName')}</div>
                </th>
                <th onClick={() => handleSort('date')} className="sortable">
                  <div className="th-content">Date {getSortIcon('date')}</div>
                </th>
                <th>Comment</th>
                <th onClick={() => handleSort('rating')} className="sortable">
                  <div className="th-content">Rating {getSortIcon('rating')}</div>
                </th>
                <th>Customer</th>
                <th>Status</th>
                <th className="action-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReviews.map(review => (
                <tr key={review.id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-avatar">{review.productName.charAt(0)}</div>
                      <span>{review.productName}</span>
                    </div>
                  </td>
                  <td className="date-cell">{formatDate(review.date)}</td>
                  <td className="comment-cell">{review.comment}</td>
                  <td>{renderStars(review.rating)}</td>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-name">{review.customerName}</div>
                      <div className="customer-email">{review.customerEmail}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${review.status}`}>
                      {review.status === 'published' ? 'Published' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn view" title="View"><FiEye /></button>
                      <button className="icon-btn delete" onClick={() => handleDelete(review.id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid-container">
          {paginatedReviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-card-header">
                <div className="customer-info">
                  <div className="customer-avatar">{getInitials(review.customerName)}</div>
                  <div>
                    <div className="customer-name">{review.customerName}</div>
                    <div className="review-date">{formatDate(review.date)}</div>
                  </div>
                </div>
                <span className={`status-badge ${review.status}`}>
                  {review.status === 'published' ? 'Published' : 'Pending'}
                </span>
              </div>

              <div className="review-product">
                <div className="product-avatar-small">{review.productName.charAt(0)}</div>
                <div>
                  <div className="product-name">{review.productName}</div>
                  {renderStars(review.rating)}
                </div>
              </div>

              <p className="review-comment">{review.comment}</p>

              <div className="review-card-footer">
                <button className="card-btn view"><FiEye /> View</button>
                <button className="card-btn delete" onClick={() => handleDelete(review.id)}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="pagination-btn">
            Prev
          </button>
          {Array.from({length: totalPages}, (_, i) => i + 1).map(page => {
            if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
              return (
                <button key={page} onClick={() => setCurrentPage(page)} className={`pagination-btn ${currentPage === page ? 'active' : ''}`}>
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="pagination-ellipsis">...</span>;
            }
            return null;
          })}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="pagination-btn">
            Next
          </button>
          <span className="pagination-info">Page {currentPage}/{totalPages} • {sortedReviews.length} results</span>
        </div>
      )}
    </div>
  );
}