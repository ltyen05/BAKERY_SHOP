import HeaderComponent from "../HeaderComponent/HeaderComponent";
import Footer from "../Footer/Footer";
const DefaultHeader = ({ children, username, onLogout }) => {
  return (
    <div className="bg-color">
      <HeaderComponent username={username} onLogout={onLogout} />
      {children}
      <Footer />
    </div>
  );
};
export default DefaultHeader;
