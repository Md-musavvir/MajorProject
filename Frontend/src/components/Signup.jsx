// components/Signup.js
import { useState } from "react";

import axios from "axios";

function Signup() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [Message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", userName);
    formData.append("email", email);
    formData.append("password", password);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        formData,
        {
          headers: { "Content-Type": "application/json" }, // 👈 important
          withCredentials: true,
        }
      );
      if (
        response.status === 200 &&
        response.data.message === "User registered succesfully"
      ) {
        setMessage("User registered succesfully");
        setError("");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setError("⚠️ All fields are required");
        } else if (err.response.status === 409) {
          setError("⚠️ User already exists");
        } else if (err.response.status === 500) {
          setError("❌ Something went wrong while registering user");
        } else {
          setError(err.response.data.message || "Registration failed");
        }
      } else {
        setError("❌ No server response");
      }
      setMessage("");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              User Name
            </label>
            <input
              type="text"
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your User Name"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
        {Message && <p className="mb-3 text-sm text-green-600">{Message}</p>}
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

export default Signup;
