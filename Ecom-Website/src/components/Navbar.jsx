import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";

export default function Navbar({ cartItems = 0 }) {
  return (
    <nav className="bg-white shadow-md p-4 w-full fixed top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="text-2xl font-bold text-blue-600">
          ReadHorizon
        </Link>

        <div className="relative flex items-center w-1/3">
          <input
            type="text"
            placeholder="Search for books..."
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 text-gray-500" size={20} />
        </div>

        <div className="hidden md:flex space-x-4 text-gray-700 font-medium">
          <Link to="/fiction" className="hover:text-blue-600">
            Fiction
          </Link>
          <span>|</span>
          <Link to="/fantasy" className="hover:text-blue-600">
            Fantasy
          </Link>
          <span>|</span>
          <Link to="/science" className="hover:text-blue-600">
            Science
          </Link>
          <span>|</span>
          <Link to="/non-fiction" className="hover:text-blue-600">
            Non-fiction
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
              Signup
            </button>
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart
              size={24}
              className="text-gray-700 hover:text-blue-600"
            />
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                {cartItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
