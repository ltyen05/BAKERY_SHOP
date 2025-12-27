import React, { useState } from 'react';
import { FiX, FiPackage, FiTag, FiDollarSign, FiFileText, FiImage } from 'react-icons/fi';
import '../../components/Common/Modal.css';

const AddProductModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '1',
    unit_price: '',
    image_url: '',
    description: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Tên sản phẩm không được để trống');
      return;
    }
    if (!formData.unit_price || parseFloat(formData.unit_price) <= 0) {
      setError('Giá sản phẩm phải lớn hơn 0');
      return;
    }

    const submitData = {
      ...formData,
      unit_price: parseFloat(formData.unit_price),
      category_id: parseInt(formData.category_id)
    };

    onSubmit(submitData);
    
    // Reset form after submit
    setFormData({
      name: '',
      category_id: '1',
      unit_price: '',
      image_url: '',
      description: ''
    });
    setError('');
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category_id: '1',
      unit_price: '',
      image_url: '',
      description: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modern-modal-overlay" onClick={handleClose}>
      <div className="modern-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modern-modal-header">
          <div className="header-icon">
            <FiPackage size={24} />
          </div>
          <div className="header-text">
            <h2>Thêm sản phẩm mới</h2>
            <p>Điền thông tin sản phẩm mới</p>
          </div>
          <button className="modern-close-btn" onClick={handleClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="modern-form" onSubmit={handleSubmit}>
          {error && (
            <div className="modern-error">{error}</div>
          )}

          <div className="form-grid">
            {/* Tên sản phẩm */}
            <div className="modern-form-group full-width">
              <label>
                Tên sản phẩm
                <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <FiPackage className="input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>
            </div>

            {/* Danh mục */}
            <div className="modern-form-group">
              <label>
                Danh mục
                <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <FiTag className="input-icon" />
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="1">Bread</option>
                  <option value="2">Cookie</option>
                  <option value="3">Pastry</option>
                </select>
              </div>
            </div>

            {/* Giá */}
            <div className="modern-form-group">
              <label>
                Giá sản phẩm (VNĐ)
                <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <FiDollarSign className="input-icon" />
                <input
                  type="number"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="1000"
                  required
                />
              </div>
            </div>

            {/* URL hình ảnh */}
            <div className="modern-form-group full-width">
              <label>URL hình ảnh</label>
              <div className="input-wrapper">
                <FiImage className="input-icon" />
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Mô tả */}
            <div className="modern-form-group full-width">
              <label>Mô tả sản phẩm</label>
              <div className="input-wrapper">
                <FiFileText className="input-icon textarea-icon" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="modern-form-actions">
            <button type="button" className="modern-btn modern-btn-cancel" onClick={handleClose}>
              Hủy
            </button>
            <button type="submit" className="modern-btn modern-btn-submit">
              <FiPackage />
              Thêm mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;