import React from "react";
import {
  FaPinterest,
  FaInstagram,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 w-full mt-4">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Company</h2>
          <ul className="space-y-2">
            <li className="hover:text-gray-400 cursor-pointer">About Us</li>
            <li className="hover:text-gray-400 cursor-pointer">Contact Us</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Policies</h2>
          <ul className="space-y-2">
            <li className="hover:text-gray-400 cursor-pointer">Terms of Use</li>
            <li className="hover:text-gray-400 cursor-pointer">
              Secure Shopping
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Help</h2>
          <ul className="space-y-2">
            <li className="hover:text-gray-400 cursor-pointer">Payment</li>
            <li className="hover:text-gray-400 cursor-pointer">Shipping</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-6">
        <a href="#" className="text-gray-400 hover:text-white text-2xl">
          <FaPinterest />
        </a>
        <a href="#" className="text-gray-400 hover:text-white text-2xl">
          <FaInstagram />
        </a>
        <a href="#" className="text-gray-400 hover:text-white text-2xl">
          <FaTwitter />
        </a>
        <a href="#" className="text-gray-400 hover:text-white text-2xl">
          <FaFacebook />
        </a>
      </div>

      <div className="text-center text-gray-500 text-sm mt-6">
        © {new Date().getFullYear()} ReadHorizon. All Rights Reserved.
      </div>
    </footer>
  );
}
