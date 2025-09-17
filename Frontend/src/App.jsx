import "./App.css";
import "react-toastify/dist/ReactToastify.css"; // ✅ import CSS

import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // ✅ import ToastContainer

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function App() {
  const cart = useSelector((state) => state.cart);
  console.log(cart);

  return (
    <div className="bg-gray-100 min-h-screen pt-16 p-2">
      <Navbar />
      <Outlet />
      <Footer />

      {/* ✅ Toast container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000} // disappears after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
