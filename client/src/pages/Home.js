import React from "react";
import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";
import Cart from "../components/Cart";

const Home = () =>
{
  return (
    <div className="container">
      <section className="leftside"><CategoryMenu /></section>
      <section className="rightside">
        <ProductList />
        <Cart />
      </section>
    </div>
  );
};

export default Home;
