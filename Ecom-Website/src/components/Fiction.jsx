import React from "react";
import { useEffect, useState } from "react";
import Card from "./Card";
export default function Fiction() {
  const [prod, setProd] = useState([]);
  useEffect(() => {
    fetch("/fic.json")
      .then((res) => res.json())
      .then((data) => setProd(data.books))
      .catch((Error) => console.log(Error));
  }, []);
  return (
    <div>
      <section className="mt-12 p-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Fictional Books
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {prod.map((book) => (
            <Card
              src={book.src}
              title={book.title}
              description={book.description}
              price={book.price}
              id={book.id}
              key={book.id}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
