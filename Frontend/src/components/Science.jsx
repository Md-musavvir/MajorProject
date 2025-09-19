import React, { useEffect, useState } from "react";

import axios from "axios";

import Card from "./Card";

function Science() {
  const [prod, setProd] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://majorproject-d54u.onrender.com/api/v1/user/getBooks/science",
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
          Science Books
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

export default Science;
