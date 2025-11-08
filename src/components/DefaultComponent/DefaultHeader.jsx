import HeaderComponent from "../HeaderComponent/HeaderComponent";
const DefaultHeader = ({ children, username, onLogout }) => {
  return (
    <div className="bg-color">
      <HeaderComponent username={username} onLogout={onLogout} />
      {children}
    </div>
  );
};
export default DefaultHeader;
