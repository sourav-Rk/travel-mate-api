import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import { config } from '../../shared/config';
import dotenv from 'dotenv';
dotenv.config();


cloudinary.config({
    cloud_name : config.cloudinary.cloud_name,
    api_key : config.cloudinary.api_key,
    api_secret : config.cloudinary.api_secret 
});

const storage = new CloudinaryStorage({
    cloudinary,
    params : async(req,file) =>({
        folder : "secure-uploads",
        resource_type : "auto",
        allowedFormats : ["jpg","png","jpeg","gif","webp","avif"],
    }),
});

const upload = multer({storage});
export {cloudinary, upload};