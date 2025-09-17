import React, { useEffect, useState } from "react";

import axios from "axios";
import { Mail, Shield, User } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found");

        const response = await axios.get(
          "http://localhost:8000/api/v1/user/userData",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return <p className="p-6 pt-20 text-center text-gray-600">Loading...</p>;
  if (error)
    return (
      <p className="p-6 pt-20 text-center text-red-500 font-semibold">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 pt-24">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-3xl font-bold">Your Profile</h2>
          <p className="text-blue-200 mt-1">Manage your account details</p>
        </div>

        <div className="p-8 grid grid-cols-1 gap-6">
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg shadow-sm">
            <User className="text-blue-600" size={28} />
            <div>
              <p className="text-gray-500 text-sm">Username</p>
              <p className="font-medium text-gray-800 text-lg">
                {user.username}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg shadow-sm">
            <Mail className="text-blue-600" size={28} />
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium text-gray-800 text-lg">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg shadow-sm">
            <Shield className="text-blue-600" size={28} />
            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <p className="font-medium text-gray-800 text-lg capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 text-center text-gray-500 text-sm">
          ReadHorizon &copy; 2025
        </div>
      </div>
    </div>
  );
}
