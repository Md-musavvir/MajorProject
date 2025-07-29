import mongoose from "mongoose";

import DB_name from "../constants.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MongoDbUrl}/${DB_name}`
    );
    console.log(
      "Database connected succesfully",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("Could not connet to database", error);
    process.exit(1);
  }
};
export default connectDb;
