import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { config } from "../../../shared/config";
dotenv.config();

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Determine resource type based on file MIME type
    const fileType = file.mimetype.split("/")[0];
    let resourceType: "image" | "video" | "raw" | "auto" = "auto";
    
    if (fileType === "image") {
      resourceType = "image";
    } else if (fileType === "video") {
      resourceType = "video";
    } else if (fileType === "audio") {
      resourceType = "raw"; // Audio files as raw
    } else {
      resourceType = "raw"; // Documents and other files
    }

    return {
      folder: "secure-uploads",
      resource_type: resourceType,
      // Only restrict formats for images, allow all for other types
      ...(resourceType === "image" && {
        allowedFormats: ["jpg", "png", "jpeg", "gif", "webp", "avif"],
      }),
      type: "authenticated",
    };
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
});
export { cloudinary, upload };
