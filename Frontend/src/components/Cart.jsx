import React from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { removeFromCart } from "../Store/cartSlice";

function Cart() {
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = async (id, name, price) => {
    try {
      console.log("reached ", id);
      dispatch(removeFromCart(id));

      const token = localStorage.getItem("accessToken");
      await axios.put(
        "http://localhost:8000/api/v1/user/removeFromCart",
        { bookId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="p-4">
      <ul className="space-y-4">
        {cart.map((item) => (
          <li
            key={item.id}
            className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition flex justify-between items-center"
          >
            <div>
              {item.name} - Quantity: {item.quantity} - Price: ₹
              {item.price * item.quantity}
            </div>

            <button
              className="text-red-500 hover:text-red-700 text-xl font-bold"
              title="Remove item"
              onClick={() => handleRemove(item.id, item.name, item.price)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      {cart.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCheckout}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
