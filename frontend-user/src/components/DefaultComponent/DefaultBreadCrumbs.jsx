import Breadcrumbs from "../BreadCrumb/BreadCrumb";

const DefaultBreadCrumbs = ({ children }) => {
  return (
    <div>
      <Breadcrumbs />
      {children}
    </div>
  );
};
export default DefaultBreadCrumbs;
