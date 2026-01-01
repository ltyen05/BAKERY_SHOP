import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../routes";
import { useProduct } from "../../context/ProductContext";

/**
 * Tìm tên route theo path (đệ quy)
 */
function getRouteNameByPath(path, routes) {
  for (const route of routes) {
    if (route.path === path) return route.name;

    if (route.children) {
      const childPath = path
        .replace(/^\//, "")
        .replace(route.path.replace(/^\//, "") + "/", "");

      const childName = getRouteNameByPath(childPath, route.children);
      if (childName) return childName;
    }
  }
  return null;
}

function Breadcrumbs() {
  const location = useLocation();
  const { currentProduct } = useProduct();

  const pathSnippets = location.pathname.split("/").filter(Boolean);
  let url = "";

  const breadcrumbItems = pathSnippets.map((segment, index) => {
    url += `/${segment}`;

    let name = getRouteNameByPath(url, routes) || segment;
    const isProductId = url.startsWith("/productDetails") && !isNaN(segment);

    if (isProductId) {
      name = currentProduct?.name || "";
    }

    const isLast = index === pathSnippets.length - 1;

    return {
      key: url,
      title:
        isLast || isProductId ? (
          <span>{name}</span>
        ) : (
          <Link to={url}>{name}</Link>
        ),
    };
  });

  // Home luôn đứng đầu
  breadcrumbItems.unshift({
    key: "/",
    title: <Link to="/">Home</Link>,
  });

  return (
    <Breadcrumb
      items={breadcrumbItems}
      style={{
        padding: "25px 0 10px",
        width: "90%",
        margin: "auto",
      }}
    />
  );
}

export default Breadcrumbs;
