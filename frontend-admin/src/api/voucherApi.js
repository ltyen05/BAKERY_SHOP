// ===============================================
// src/api/voucherApi.js
// ===============================================
import api from './axiosConfig';

const BASE_PATH = '/admin/coupon';

/**
 * Transform data từ Backend sang Frontend format
 * Chỉ map những field mà backend TRẢ VỀ
 */
const transformToFrontendFormat = (data) => {
  // Xác định xem là discount percent hay fixed value
  // Nếu discount_value = 0 thì có thể là discount_percent
  const hasPercentDiscount = data.discount_value === 0 || data.discount_value === null;
  
  return {
    id: data.coupon_id,
    code: `VOUCHER${String(data.coupon_id).padStart(3, '0')}`, // VD: VOUCHER001
    name: data.description || `Mã giảm giá #${data.coupon_id}`,
    
    // Xử lý discount: nếu discount_value = 0 thì fallback về 10%
    discount: hasPercentDiscount ? 10 : parseFloat(data.discount_value),
    type: hasPercentDiscount ? 'percent' : 'fixed',
    
    minOrder: 0, // Backend chưa có field này
    maxDiscount: null, // Backend chưa có field này
    quantity: 100, // Giả định
    used: 0, // Backend chưa có field used_count
    
    startDate: data.begin_date || '',
    endDate: data.end_date || '',
    status: data.status === 'active' ? 'Active' : 'Expired',
    level: 'Normal' // Backend chưa có field này
  };
};

/**
 * Transform data từ Frontend sang Backend format
 * Chỉ gửi những field mà backend CHẤP NHẬN
 */
const transformToBackendFormat = (data) => {
  return {
    discount_value: parseFloat(data.discount || 0),
    begin_date: data.startDate,
    end_date: data.endDate,
    status: data.status?.toLowerCase() === 'active' ? 'active' : 'expired'
  };
};

export const couponApi = {
  /**
   * Lấy danh sách tất cả coupon
   */
  getAllCoupons: async (params = {}) => {
    try {
      const response = await api.get(BASE_PATH, { params });
      
      if (Array.isArray(response.data)) {
        return response.data.map(transformToFrontendFormat);
      }
      
      return [];
    } catch (error) {
      console.error(' Error fetching coupons:', error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết một coupon theo ID
   */
  getCouponById: async (couponId) => {
    try {
      const response = await api.get(`${BASE_PATH}/${couponId}`);
      return transformToFrontendFormat(response.data);
    } catch (error) {
      console.error(` Error fetching coupon ${couponId}:`, error);
      throw error;
    }
  },

  /**
   * Thêm coupon mới
   */
  addCoupon: async (data) => {
    try {
      const backendData = transformToBackendFormat(data);
      const response = await api.post(BASE_PATH, backendData);
      
      console.log(' Coupon added successfully:', response.data);
      return {
        success: true,
        message: response.data.message || 'Thêm coupon thành công',
        id: response.data.id
      };
    } catch (error) {
      console.error(' Error adding coupon:', error);
      throw error;
    }
  },

  /**
   * Cập nhật coupon
   */
  updateCoupon: async (couponId, data) => {
    try {
      const backendData = transformToBackendFormat(data);
      const response = await api.put(`${BASE_PATH}/${couponId}`, backendData);
      
      console.log(' Coupon updated successfully:', response.data);
      return {
        success: true,
        message: response.data.message || 'Cập nhật coupon thành công'
      };
    } catch (error) {
      console.error(` Error updating coupon ${couponId}:`, error);
      throw error;
    }
  },

  /**
   * Xóa coupon
   */
  deleteCoupon: async (couponId) => {
    try {
      const response = await api.delete(`${BASE_PATH}/${couponId}`);
      
      console.log(' Coupon deleted successfully');
      return {
        success: true,
        message: response.data.message || 'Xóa coupon thành công'
      };
    } catch (error) {
      console.error(` Error deleting coupon ${couponId}:`, error);
      throw error;
    }
  },

  /**
   * Lọc coupon theo status
   */
  getCouponsByStatus: async (status) => {
    try {
      const response = await api.get(BASE_PATH, {
        params: { status: status.toLowerCase() }
      });
      
      if (Array.isArray(response.data)) {
        return response.data.map(transformToFrontendFormat);
      }
      
      return [];
    } catch (error) {
      console.error(` Error fetching coupons by status ${status}:`, error);
      throw error;
    }
  }
};

export default couponApi;