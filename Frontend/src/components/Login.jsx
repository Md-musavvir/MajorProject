import React, { useState } from "react";

// components/Login.js
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const { accessToken, refreshToken, user } = response.data.data;
      console.log(response);
      if (response.status === 200 && accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        // Backend responded with an error
        if (error.response.status === 400) {
          setError(error.response.data.message);
        } else if (error.response.status === 404) {
          setError(error.response.data.message);
        } else if (error.response.status === 401) {
          setError(error.response.data.message);
        } else {
          setError(error.response.data.message || "❌ Unexpected error");
        }
      } else {
        // No response (e.g., server down or network issue)
        setError("❌ No server response");
      }

      setMessage(""); // clear success message
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        {message && <p className="mb-3 text-sm text-green-600">{message}</p>}
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
