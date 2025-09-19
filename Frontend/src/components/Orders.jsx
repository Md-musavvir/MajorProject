import React, { useEffect, useState } from "react";

import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://majorproject-d54u.onrender.com/api/v1/user/getOrders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading orders...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-2xl shadow-md p-6 bg-white"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Order ID: {order._id}</h3>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-medium">{order.status}</span>
                </p>
              </div>

              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{item.book.title}</p>
                      <p className="text-sm text-gray-500">
                        Author: {item.book.author}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: ₹{item.book.price}
                      </p>
                    </div>
                    <p className="font-medium">Qty: {item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <p className="font-semibold">Total: ₹{order.total}</p>
                <p className="text-sm text-gray-600">
                  Payment: {order.paymentMethod.toUpperCase()}
                </p>
                <p className="text-sm text-gray-600">
                  Address: {order.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
