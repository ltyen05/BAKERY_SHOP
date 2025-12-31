// ===============================================
// src/api/voucherApi.js - FIXED VERSION (NO UPDATE)
// ===============================================
import api from './axiosConfig';

// Backend endpoint thực tế (đã test thành công)
const BASE_PATH = '/admin/coupon_management/coupon';

/**
 * Transform data từ Backend sang Frontend format
 * Map đúng với response từ backend
 */
const transformToFrontendFormat = (data) => {
  // Backend trả về discount_type: 'percent' hoặc 'value'
  const isPercent = data.discount_type === 'percent';
  
  return {
    id: data.coupon_id,
    code: `VOUCHER${String(data.coupon_id).padStart(3, '0')}`,
    name: data.description || `Mã giảm giá #${data.coupon_id}`,
    
    // Xử lý discount dựa trên discount_type
    discount: isPercent 
      ? parseFloat(data.discount_percent || 0)
      : parseFloat(data.discount_value || 0),
    type: isPercent ? 'percent' : 'fixed',
    
    // Backend có đầy đủ các field này
    minOrder: parseFloat(data.min_purchase || 0),
    maxDiscount: parseFloat(data.max_discount || 0),
    quantity: 100, // Backend chưa có field quantity
    used: parseInt(data.used_count || 0),
    
    startDate: data.begin_date || '',
    endDate: data.end_date || '',
    
    // Status TỰ ĐỘNG cập nhật dựa trên begin_date/end_date
    // Frontend CHỈ HIỂN THỊ, KHÔNG EDIT
    status: data.status === 'active' ? 'Active' : 'Expired',
    
    level: 'Normal', // Backend chưa có
    createdAt: data.created_at || '',
  };
};

/**
 * Transform data từ Frontend sang Backend format
 * CHỈ dùng cho ADD - KHÔNG CÓ UPDATE
 */
const transformToBackendFormatAdd = (data) => {
  const isPercent = data.type === 'percent';
  
  return {
    description: data.name,
    discount_percent: isPercent ? parseFloat(data.discount || 0) : null,
    discount_value: !isPercent ? parseFloat(data.discount || 0) : null,
    discount_type: isPercent ? 'percent' : 'value',
    min_purchase: parseFloat(data.minOrder || 0),
    max_discount: parseFloat(data.maxDiscount || 0),
    begin_date: data.startDate,
    end_date: data.endDate,
    // KHÔNG GỬI status - backend tự động xử lý dựa trên date
    used_count: 0, // Mặc định 0
  };
};

export const couponApi = {
  /**
   * Lấy danh sách tất cả coupon
   * Có thể filter theo status: active/expired
   */
  getAllCoupons: async (params = {}) => {
    try {
      const response = await api.get(BASE_PATH, { params });
      
      if (Array.isArray(response.data)) {
        return response.data.map(transformToFrontendFormat);
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error fetching coupons:', error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết một coupon theo ID
   * Note: Backend chưa có endpoint này, dùng cách lấy toàn bộ rồi filter
   */
  getCouponById: async (couponId) => {
    try {
      const allCoupons = await couponApi.getAllCoupons();
      const coupon = allCoupons.find(c => c.id === couponId);
      
      if (!coupon) {
        throw new Error(`Không tìm thấy coupon với ID ${couponId}`);
      }
      
      return coupon;
    } catch (error) {
      console.error(`❌ Error fetching coupon ${couponId}:`, error);
      throw error;
    }
  },

  /**
   * Thêm coupon mới
   * Endpoint: POST /admin/coupon_management/add_coupon
   * Status sẽ TỰ ĐỘNG được backend xử lý dựa trên begin_date/end_date
   */
  addCoupon: async (data) => {
    try {
      const backendData = transformToBackendFormatAdd(data);
      const response = await api.post('/admin/coupon_management/add_coupon', backendData);
      
      console.log('✅ Coupon added successfully:', response.data);
      return {
        success: true,
        message: response.data.message || 'Thêm coupon thành công',
        id: response.data.id
      };
    } catch (error) {
      console.error('❌ Error adding coupon:', error);
      throw error;
    }
  },

  /**
   * Xóa coupon
   * Endpoint: DELETE /admin/coupon_management/delete_coupon/:id
   */
  deleteCoupon: async (couponId) => {
    try {
      const response = await api.delete(`/admin/coupon_management/delete_coupon/${couponId}`);
      
      console.log('✅ Coupon deleted successfully');
      return {
        success: true,
        message: response.data.message || 'Xóa coupon thành công'
      };
    } catch (error) {
      console.error(`❌ Error deleting coupon ${couponId}:`, error);
      throw error;
    }
  },

  /**
   * Lọc coupon theo status
   * Sử dụng params ?status=active hoặc ?status=expired
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
      console.error(`❌ Error fetching coupons by status ${status}:`, error);
      throw error;
    }
  }
};

export default couponApi;