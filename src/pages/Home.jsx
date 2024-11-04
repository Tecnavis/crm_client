import { Fragment } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Section from "../components/Section";
import { products } from "../utils/products";
import SliderHome from "../components/Slider";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";
import Allcategory from "./allcategory";
import Newarrivals from './newarrivals'
import Bestsales from "./bestsales";
const Home = () => {
  const newArrivalData = products.filter(
    (item) => item.category === "mobile" || item.category === "wireless"
  );
  const bestSales = products.filter((item) => item.category === "sofa");
  useWindowScrollToTop();
  const customer = JSON.parse(localStorage.getItem("customerDetails"));
  if(customer){
  return (
    <Fragment>
      <SliderHome />
      <Wrapper />
      <Allcategory />
      <Newarrivals />
      <Bestsales />
    </Fragment>
  );
}else{
  window.location.href="/404"
}
};

export default Home;
