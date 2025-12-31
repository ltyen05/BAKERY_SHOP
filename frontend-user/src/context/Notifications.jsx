import { createContext, useContext, useEffect, useState, useRef } from "react";
import { notificationApi } from "../api/customer_notifications";
import { useAuth } from "../context/AuthContext";
const Notification = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const latestIdRef = useRef(null);
  const totalCountRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  const isCustomer = user?.role === "customer";

  const fetchAllNotifications = async (page = 1, reset = false) => {
    if (!isCustomer || isLoadingMoreRef.current) return;
    isLoadingMoreRef.current = true;
    setLoading(true);
    try {
      const res = await notificationApi.all_notifications();
      if (!res.ok) return;
      const data = await res.json();
      const formatted = data.data.map((n) => ({
        id: n.id,
        time: n.created_at,
        unread: !n.is_read,
        orderId: n.order_id,
        address: n.address || "",
      }));

      setNotifications((prev) => (reset ? formatted : [...prev, ...formatted]));
      setHasMore(data.current_page < data.total_pages);
      setCurrentPage(page);
      if (formatted.length > 0 && page === 1) {
        latestIdRef.current = formatted[0].id;
        totalCountRef.current = data.total_notifications;
      }
    } finally {
      setLoading(false);
      isLoadingMoreRef.current = false;
    }
  };
  const checkForNewNotifications = async () => {
    if (!isCustomer) return;
    try {
      const res = await notificationApi.check_status();
      if (!res.ok) return;
      const data = await res.json();
      const hasNew =
        totalCountRef.current > 0 &&
        (data.total_count > totalCountRef.current ||
          (data.latest_id && data.latest_id !== latestIdRef.current));
      if (hasNew) {
        await fetchAllNotifications(1, true);
        new Notification("Đơn hàng mới!", {
          body: "Bạn có đơn hàng mới cần xử lý",
          icon: bakesLogo,
        });
        totalCountRef.current = data.total_count;
        latestIdRef.current = data.latest_id;
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (!isCustomer) return;
    fetchAllNotifications(1);
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") checkForNewNotifications();
    }, 20000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") checkForNewNotifications();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isCustomer]);

  return (
    <Notification.Provider
      value={{
        notifications,
        setNotifications,
        loading,
        hasMore,
        currentPage,
        fetchAllNotifications,
        checkForNewNotifications,
      }}
    >
      {children}
    </Notification.Provider>
  );
}

export const useNotification = () => {
  const ctx = useContext(Notification);
  if (!ctx)
    throw new Error("notification must be used inside NotificationProvider");
  return ctx;
};
