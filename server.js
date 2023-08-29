import app from "./app.js";
import connectdb from "./config/db.js";
import cloudinary from 'cloudinary';
const PORT=process.env.PORT||4000
// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(PORT,()=>{
    connectdb();
    console.log(`app is listen on the port:${PORT}`)
});
