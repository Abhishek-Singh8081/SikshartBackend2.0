import cloudinary from 'cloudinary';

const clodinaryConnect=()=>{
    try {
        cloudinary.v2.config({
            cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
            api_key:process.env.CLOUDINARY_API_KEY, 
            api_secret:process.env.CLOUDINARY_API_SECRET,
            secure:true
        });
        console.log("Cloudinary connected");
        
    } catch (error) {
        console.log("Cloudinary connection error",error.message);
        
    }
}
export default clodinaryConnect; 