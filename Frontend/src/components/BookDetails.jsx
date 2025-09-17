import React, { useEffect, useState } from "react";

import axios from "axios";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { addToCart, removeFromCart } from "../Store/cartSlice";

export default function BookDetails() {
  const { id } = useParams(); // Book ID from URL
  const dispatch = useDispatch();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/fetchBook/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBook(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch book");
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    if (!book) return;
    setAdding(true);

    try {
      dispatch(
        addToCart({ id: book._id, name: book.title, price: book.price })
      );

      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:8000/api/v1/user/addToCart",
        { bookId: book._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`${book.title} added to cart successfully!`);
    } catch (err) {
      dispatch(removeFromCart(book._id));
      console.error("Failed to add to cart:", err);
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return <div className="p-4 text-center text-gray-500">Loading book...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!book) return null;

  return (
    <div className="container mx-auto mt-32 p-8 flex flex-col md:flex-row gap-12 bg-white rounded-2xl shadow-2xl border border-gray-200">
      <div className="md:w-1/3 flex justify-center items-start">
        <img
          src={book.image}
          alt={book.title}
          className="w-full max-w-xs md:max-w-sm rounded-2xl shadow-lg border border-gray-300"
        />
      </div>

      <div className="md:w-2/3 flex flex-col justify-start gap-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 capitalize">
          {book.title}
        </h1>
        <p className="text-xl text-gray-700">
          <span className="font-semibold">Author:</span> {book.author}
        </p>
        <p className="text-xl text-gray-700">
          <span className="font-semibold">Price:</span>{" "}
          <span className="text-green-600">${book.price}</span>
        </p>
        <p className="text-xl text-gray-700 capitalize">
          <span className="font-semibold">Category:</span> {book.category}
        </p>

        <p className="text-gray-600 leading-relaxed mt-4">
          {book.description ||
            "No description available. This section can contain the book synopsis, author notes, or other relevant details."}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={adding}
          className={`mt-6 w-44 md:w-56 py-3 font-semibold rounded-lg transition ${
            adding
              ? "bg-gray-400 cursor-not-allowed text-gray-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
