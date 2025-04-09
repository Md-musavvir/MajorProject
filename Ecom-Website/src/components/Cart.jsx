import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../Store/cartSlice";

function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="p-4">
      <ul className="space-y-4">
        {cart.map((item, index) => (
          <li
            key={item.id}
            className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition flex justify-between items-center"
          >
            <div>
              {item.name} - Quantity: {item.quantity} - Price: ₹
              {item.price * item.quantity}
            </div>

            <button
              className="text-red-500 hover:text-red-700 text-xl font-bold"
              title="Remove item"
              onClick={() => handleRemove(item.id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Cart;
