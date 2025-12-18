import HeaderComponent from "../HeaderComponent/HeaderComponent";
import Footer from "../Footer/Footer";
const DefaultHeader = ({ children, user, onLogout }) => {
  return (
    <div className="bg-color">
      <HeaderComponent user={user} onLogout={onLogout} />

      {children}
      <Footer />
    </div>
  );
};
export default DefaultHeader;
