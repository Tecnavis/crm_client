import { lazy, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Loader from "./components/Loader/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Product = lazy(() => import("./pages/Product"));
const CategoryProduct = lazy(() => import("./pages/categoryproduct"));
const Register = lazy(() => import("./pages/register"));
const Signin = lazy(() => import("./pages/signin"));
const Whishlist = lazy(() => import("./pages/whishlist"));
const Profile = lazy(() => import("./pages/profile"));
const Error = lazy(() => import("./pages/404"));

function Layout() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === "/register" || location.pathname === "/" ||location.pathname=== "/404"  ;


  return (
    <>
      {!hideNavAndFooter && <NavBar />}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/category" element={<CategoryProduct />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Signin />} />
        <Route path="/whishlist" element={<Whishlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Error />} />
        <Route path="/404" element={<Error />} />

      </Routes>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Layout />
      </Router>
    </Suspense>
  );
}

export default App;
