import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, removeFromCart } from "../Store/cartSlice";

function Card({ src, title, author, price, id }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.stopPropagation();
    try {
      dispatch(addToCart({ id, name: title, price }));
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/addToCart",
        { bookId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
      dispatch(removeFromCart(id));
    }
  };

  const handleCardClick = () => {
    navigate(`/book/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 p-4 transition-transform duration-300 hover:scale-105 cursor-pointer"
    >
      <img
        src={src}
        alt={title}
        className="w-full h-48 object-cover rounded-md"
      />
      <div className="mt-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{author}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-gray-900 font-medium text-base">₹ {price}</span>
          <button
            className="px-3 py-1 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition"
            onClick={handleClick}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
