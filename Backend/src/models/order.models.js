import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    address: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "netbanking", "emi"],
      lowercase: true,
    },
  },
  { timestamps: true }
);
export const Order = mongoose.model("Order", orderSchema);
