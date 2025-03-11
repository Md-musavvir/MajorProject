import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../Store/cartSlice";

function Card({ src, title, description, price, id }) {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(addToCart({ id, name: title, price }));
  };
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 p-4 transition-transform duration-300 hover:scale-105">
      <img
        src={src}
        alt={title}
        className="w-full h-48 object-cover rounded-md"
      />
      <div className="mt-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
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
