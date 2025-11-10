import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";


const chatMediaStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const fileType = file.mimetype.split("/")[0];
    let resourceType: "image" | "video" | "raw" | "auto" = "auto";
    let folder = "chat-media";

    
    if (fileType === "image") {
      resourceType = "image";
      folder = "chat-media/images";
    } else if (fileType === "video") {
      resourceType = "video";
      folder = "chat-media/videos";
    } else if (fileType === "audio") {
      resourceType = "raw";
      folder = "chat-media/voice";
    } else {
      resourceType = "raw"; 
      folder = "chat-media/files";
    }

    return {
      folder,
      resource_type: resourceType,
      type: "authenticated",
      // Allow various formats
      allowed_formats: fileType === "image" 
        ? ["jpg", "png", "jpeg", "gif", "webp", "avif"]
        : fileType === "video"
        ? ["mp4", "mov", "avi", "wmv", "flv", "webm"]
        : fileType === "audio"
        ? ["mp3", "wav", "ogg", "m4a", "aac"]
        : undefined, 
    };
  },
});

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for videos and files
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB for images
const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB for voice messages

export const chatMediaUpload = multer({
  storage: chatMediaStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[0];
    const fileSize = parseInt(req.headers["content-length"] || "0");

   
    if (fileType === "image" && fileSize > MAX_IMAGE_SIZE) {
      return cb(new Error("Image size exceeds 10MB limit"));
    }
    if (fileType === "audio" && fileSize > MAX_AUDIO_SIZE) {
      return cb(new Error("Audio file size exceeds 10MB limit"));
    }
    if (fileType !== "image" && fileType !== "audio" && fileSize > MAX_FILE_SIZE) {
      return cb(new Error("File size exceeds 50MB limit"));
    }

    cb(null, true);
  },
});

export { cloudinary };


