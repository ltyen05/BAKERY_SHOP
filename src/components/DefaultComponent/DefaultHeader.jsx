import HeaderComponent from "../HeaderComponent/HeaderComponent";
const DefaultHeader = ({ children, username, onLogout }) => {
  return (
    <div>
      <HeaderComponent username={username} onLogout={onLogout} />
      {children}
    </div>
  );
};
export default DefaultHeader;
