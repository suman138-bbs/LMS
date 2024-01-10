import { app } from "./app";
import connectDB from "./utils/db";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//create our server

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`server is connected with port ${process.env.PORT} `);
});
