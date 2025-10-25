import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../routes";

// Hàm đệ quy tìm tên route từ path
function getRouteNameByPath(path, routes) {
  for (const route of routes) {
    // match tuyệt đối
    if (route.path === path) return route.name;

    // match path con (ví dụ: /menu/cake)
    if (route.children) {
      const childName = getRouteNameByPath(
        path
          .replace(/^\//, "")
          .replace(route.path.replace(/^\//, "") + "/", ""),
        route.children
      );
      if (childName) return childName;
    }
  }
  return null;
}

function Breadcrumbs() {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter(Boolean);

  let url = "";
  const breadcrumbItems = pathSnippets.map((segment) => {
    url += `/${segment}`;
    const name = getRouteNameByPath(url, routes) || segment;
    return { key: url, title: <Link to={url}>{name}</Link> };
  });

  breadcrumbItems.unshift({ key: "/", title: <Link to="/">Home</Link> });

  return <Breadcrumb items={breadcrumbItems} style={{ padding: "10px 0" }} />;
}

export default Breadcrumbs;
