import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
})

const uploadImageCloudinary = async (Image) => {
    const buffer = Image?.buffer || Buffer.from(await Image.arrayBuffer())

    const uploadImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({folder: "Binkey"}, (error, uploadResult) => {
            return resolve(uploadResult);
        }).end(buffer)  
    })
    return uploadImage;
}

export default uploadImageCloudinary;