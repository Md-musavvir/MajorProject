import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";
import fs from "fs";

configDotenv();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) {
      console.log("no file path provided");
      return null;
    }

    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });

    await fs.promises.unlink(localPath);
    return response;
  } catch (error) {
    if (fs.existsSync(localPath)) {
      await fs.promises.unlink(localPath);
    }
    return null;
  }
};
export default uploadOnCloudinary;
