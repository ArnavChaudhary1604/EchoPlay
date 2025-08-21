import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { extractPublicId } from 'cloudinary-build-url'

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary= async (localFilePath) => {
    try{
        if(!localFilePath) return null;

        //upload the file on cloudinary

        const response= await cloudinary.uploader.upload(localFilePath,
            {
                resource_type: "auto"
            })
        //file has been oploaded succesfully
        // console.log("file is uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath);
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath) // remove the locally saved temp file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (url) =>{
    try{
        if(!url){
            return null
        }

        const publicId = await extractPublicId(url)

        const response = await cloudinary.uploader.destroy(publicId)

        if (response.result !== "ok") {
            console.log("Cloudinary delete issue:", response.result);
            return null
        }

        return response
    }
    catch(error){
        return null
    }
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary
}