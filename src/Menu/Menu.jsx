import { Outlet } from "react-router-dom";
function Menu() {
  return (
    <div>
      <h1>This is menu</h1>
      <Outlet />
    </div>
  );
}
export default Menu;
