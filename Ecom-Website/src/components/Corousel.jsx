import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ ...style, display: "block", color: "#111" }}
      onClick={onClick}
    >
      &#9665;
    </button>
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ ...style, display: "block", color: "#111" }}
      onClick={onClick}
    >
      &#9655;
    </button>
  );
};

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h2 className="text-2xl font-bold text-center mb-5">Our Top Authors</h2>
      <Slider {...settings}>
        <div className="px-2 text-center">
          <img
            src="./Assets/martin.png"
            alt="Book 1"
            className="rounded-lg shadow-md w-full h-60 object-cover transition-transform duration-300 hover:scale-105 focus:scale-105"
          />
          <p className="mt-2 font-semibold">George R.R. Martin</p>
        </div>
        <div className="px-2 text-center">
          <img
            src="./Assets/rowling.png"
            alt="Book 2"
            className="rounded-lg shadow-md w-full h-60 object-cover transition-transform duration-300 hover:scale-105 focus:scale-105"
          />
          <p className="mt-2 font-semibold">J.K. Rowling</p>
        </div>
        <div className="px-2 text-center">
          <img
            src="./Assets/brandon.png"
            alt="Book 3"
            className="rounded-lg shadow-md w-full h-60 object-cover transition-transform duration-300 hover:scale-105 focus:scale-105"
          />
          <p className="mt-2 font-semibold">Brandon Sanderson</p>
        </div>
        <div className="px-2 text-center">
          <img
            src="./Assets/haruki.png"
            alt="Book 4"
            className="rounded-lg shadow-md w-full h-60 object-cover transition-transform duration-300 hover:scale-105 focus:scale-105"
          />
          <p className="mt-2 font-semibold">Haruki Murakami</p>
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
