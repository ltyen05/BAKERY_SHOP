
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";
import "./App.css";

function renderRoutes(routes) {
  return routes.map((route) => {
    const Page = route.page;
    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={<Page />}>
          {renderRoutes(route.children)}
        </Route>
      );
    } else {
      return <Route key={route.path} path={route.path} element={<Page />} />;
    }
  });
}
function App() {
  return (
    <Router>
      <HeaderComponent />
      <Routes> {renderRoutes(routes)}</Routes>
    </Router>
  );
}

export default App;
