import mongoose from "mongoose";
mongoose.set('strictQuery',false);
const connectdb=()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then((conn)=>{
        console.log(`database connected:${conn.connection.host}`);
    })
    .catch((err)=>{
        console.log(err.message)
    });
    
}
export default connectdb;