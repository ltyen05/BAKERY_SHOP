import HeaderComponent from "../HeaderComponent/HeaderComponent";
import Footer from "../Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
const DefaultHeader = ({ children }) => {
  const { user, logout } = useAuth();
  const { productInCart, refetchCart, setProductInCart } = useOrder();
  return (
    <div className="bg-color">
      <HeaderComponent
        user={user}
        onLogout={logout}
        productInCart={productInCart}
        refetchCart={refetchCart}
        setProductInCart={setProductInCart}
      />

      {children}
      <Footer />
    </div>
  );
};
export default DefaultHeader;
