import React, { useEffect, useState } from "react";

import axios from "axios";

import Card from "./Card";

function NonFiction() {
  const [prod, setProd] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/api/v1/user/getBooks/non-fiction",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setProd(response.data.data || []);
      } catch (error) {
        console.error(error);
        setProd([]);
      }
    };
    fetchBook();
  }, []);

  return (
    <div>
      <section className="mt-12 p-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Non-fiction Books
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {prod.map((book) => (
            <Card
              src={book.image}
              author={book.author}
              title={book.title}
              price={book.price}
              id={book._id}
              key={book._id}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default NonFiction;
