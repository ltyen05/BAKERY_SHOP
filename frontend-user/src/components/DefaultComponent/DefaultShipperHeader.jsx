import HeaderComponent from "../HeaderComponent/ShipperHeader";
import Footer from "../Footer/Footer";
import { useAuth } from "../../context/AuthContext";
const DefaultHeader = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <div className="bg-color">
      <HeaderComponent user={user} onLogout={logout} />

      {children}
      <Footer />
    </div>
  );
};
export default DefaultHeader;
