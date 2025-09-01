import React, { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  // Fetch cart items from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/api/v1/user/getCart",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Extract items and grand total based on your controller response
        const items = response.data.data?.item || [];
        const total = response.data.data?.grandTotal || 0;

        setCartItems(items);
        setGrandTotal(total);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart items.");
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Handle order placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const orderPayload = {
      items: cartItems.map((item) => ({
        book: item.bookId,
        quantity: item.quantity,
      })),
      total: grandTotal,
      address,
      paymentMethod,
    };

    try {
      setPlacingOrder(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/placeOrder",
        orderPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Order placed successfully!");
      console.log("Order response:", response.data);

      // Optionally redirect to home or order confirmation page
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading)
    return (
      <p className="p-6 text-center text-gray-500 text-lg font-medium">
        Loading cart...
      </p>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
        Checkout
      </h1>

      {error && (
        <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
      )}
      {success && (
        <p className="text-green-600 mb-4 text-center font-medium">{success}</p>
      )}

      {/* Cart Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        ) : (
          <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {cartItems.map((item) => (
              <li
                key={item.bookId}
                className="py-3 px-4 flex justify-between items-center bg-white hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-gray-500 text-sm">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-gray-900">
                  ₹{item.totalPrice}
                </span>
              </li>
            ))}
            <li className="py-3 px-4 flex justify-between items-center bg-gray-50 font-bold text-lg">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </li>
          </ul>
        )}
      </div>

      {/* Address & Payment Form */}
      <form
        onSubmit={handlePlaceOrder}
        className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-6"
      >
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Delivery Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your delivery address"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="netbanking">Net Banking</option>
            <option value="emi">EMI</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={placingOrder}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all transform ${
            placingOrder ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
          }`}
        >
          {placingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
