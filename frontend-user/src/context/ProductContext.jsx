import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/product/top-selling"
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setTopProducts(data);
        } else {
          setTopProducts([]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <ProductContext.Provider
      value={{ currentProduct, topProducts, setCurrentProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
