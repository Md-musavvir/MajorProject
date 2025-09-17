import React, { useEffect, useState } from "react";

import Carousel from "./Corousel";

export default function Home() {
  const [prod, setProd] = useState([]);

  useEffect(() => {
    fetch("/books.json")
      .then((res) => res.json())
      .then((data) => setProd(data.books))
      .catch((error) => console.log(error));
  }, []);
  return (
    <div>
      <div className="bg-blue-50 py-8 flex justify-center">
        <img
          src="./Assets/Poster.png"
          alt="Book Store Banner"
          className="w-[90%] md:w-[85%] lg:w-[80%] rounded-lg shadow-lg"
        />
      </div>
      <section className="flex justify-center items-center p-8">
        <p className="text-center text-lg md:text-xl text-gray-800 max-w-3xl mx-auto bg-blue-50 p-6 rounded-lg shadow-md leading-relaxed">
          <span className="font-semibold text-blue-600">
            Welcome to ReadHorizon
          </span>{" "}
          – Your Gateway to Endless Stories! At
          <span className="font-semibold text-blue-600"> ReadHorizon</span>, we
          bring you a carefully curated collection of books across genres like{" "}
          <span className="text-blue-500">Fiction, Fantasy, Science,</span> and{" "}
          <span className="text-blue-500">Non-Fiction</span>. Whether you're a
          passionate reader or just getting started, we have something for
          everyone. Discover
          <span className="italic">
            {" "}
            bestsellers, hidden gems, and timeless classics
          </span>{" "}
          — all in one place.
          <br />
          <br />
          With a seamless shopping experience and a growing library of books,
          <span className="font-semibold text-blue-600"> ReadHorizon</span> is
          here to fuel your love for reading.
          <span className="text-yellow-500"> 📚✨</span> <br />
          <span className="text-gray-600 font-semibold">
            Explore. Read. Enjoy.
          </span>{" "}
          <span className="text-blue-400">🚀</span>
        </p>
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Words from Great Authors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            {
              id: 1,
              quote:
                "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
              author: "George R.R. Martin",
            },
            {
              id: 2,
              quote:
                "Until I feared I would lose it, I never loved to read. One does not love breathing.",
              author: "Harper Lee",
            },
            {
              id: 3,
              quote:
                "The more that you read, the more things you will know. The more that you learn, the more places you’ll go.",
              author: "Dr. Seuss",
            },
            {
              id: 4,
              quote:
                "If you only read the books that everyone else is reading, you can only think what everyone else is thinking.",
              author: "Haruki Murakami",
            },
          ].map((q) => (
            <div
              key={q.id}
              className="bg-gradient-to-br from-yellow-50 to-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <p className="text-gray-700 italic text-lg mb-4 leading-relaxed">
                “{q.quote}”
              </p>
              <p className="text-right text-gray-600 font-semibold">
                — {q.author}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Carousel />
    </div>
  );
}
