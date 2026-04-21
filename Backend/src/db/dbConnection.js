import dns from "node:dns";

import mongoose from "mongoose";

import DB_name from "../constants.js";

// Force IPv4 and use Google's DNS to bypass ISP/Node.js bugs
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDb = async () => {
  try {
    const url = process.env.MongoDbUrl;

    if (!url) {
      throw new Error("MongoDbUrl is missing from environment variables.");
    }

    const connectionInstance = await mongoose.connect(`${url}/${DB_name}`);

    console.log(
      `✅ MongoDB Connected! Host: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

export default connectDb;
