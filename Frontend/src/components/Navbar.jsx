import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import { Search, ShoppingCart, User, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Cart from "./Cart";

export default function Navbar({ cartItems = 0 }) {
  const [showCart, setShowCart] = useState(false);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [username, setUsername] = useState("User");

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axios
      .get("http://localhost:8000/api/v1/user/userData", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsername(res.data.data.username || res.data.data.email))
      .catch((err) => console.error("Failed to fetch user:", err));
  }, []);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/getBook?title=${value}`,
          { headers: { Authorization: `Bearer ${token}` } } // send token
        );

        const books = Array.isArray(res.data.data)
          ? res.data.data
          : [res.data.data];
        setSuggestions(books);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      navigate(`/book/${suggestions[0]._id}`); // redirect to first match
      setQuery("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (bookId) => {
    navigate(`/book/${bookId}`);
    setQuery("");
    setSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="bg-white shadow-md p-4 w-full fixed top-0 left-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ReadHorizon
          </Link>

          <div ref={searchRef} className="relative flex items-center w-1/3">
            <input
              type="text"
              placeholder="Search for books..."
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 text-gray-500" size={20} />

            {suggestions.length > 0 && (
              <ul className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {suggestions.map((book) => (
                  <li
                    key={book._id}
                    onClick={() => handleSuggestionClick(book._id)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="font-medium capitalize">{book.title}</div>
                    <div className="text-sm text-gray-500">
                      {book.author} • ${book.price}
                    </div>
                  </li>
                ))}
              </ul>
            )}
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
            <button onClick={() => setShowCart(true)} className="relative">
              <ShoppingCart
                size={24}
                className="text-gray-700 hover:text-blue-600"
              />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                  {cartItems}
                </span>
              )}
            </button>

            <button onClick={() => setShowUserPanel(true)} className="relative">
              <User size={24} className="text-gray-700 hover:text-blue-600" />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${
          showCart ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={() => setShowCart(false)}>
            <X className="text-gray-700 hover:text-red-600" />
          </button>
        </div>
        <Cart />
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${
          showUserPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">User Panel</h2>
          <button onClick={() => setShowUserPanel(false)}>
            <X className="text-gray-700 hover:text-red-600" />
          </button>
        </div>

        <div className="p-4">
          <p className="mb-4 font-medium">Hello, {username}!</p>
          <Link
            to="/profile"
            className="block mb-2 text-blue-500 hover:underline"
            onClick={() => setShowUserPanel(false)}
          >
            Profile
          </Link>
          <Link
            to="/orders"
            className="block mb-2 text-blue-500 hover:underline"
            onClick={() => setShowUserPanel(false)}
          >
            Orders
          </Link>
          <button
            className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
