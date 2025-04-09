import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Cart from "./components/Cart";

function App() {
  const cart = useSelector((state) => state.cart);
  console.log(cart);
  return (
    <div className="bg-gray-100 min-h-screen pt-16 p-2">
      <Navbar />
      <Outlet />
      <Footer />
      <Cart />
    </div>
  );
}

export default App;
