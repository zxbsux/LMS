
import userModel from "../model/userModel.js";
import AppError from "../utils/errUtils.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
const cookieOptions={
    maxAge:7*60*60*1000,
    httpOnly:true,
    secure:true
}

const register= async(req,res,next)=>{
  const { fullName,email,password}=req.body;
  if(!fullName||!email||!password){
    return next(new AppError('all field is required',400));
  }
  const userexits=await userModel.findOne({email});
  if(userexits){
    return next(new AppError('user already exist',400));
  }
const user=await userModel.create({
    fullName,
    email,
    password,
    avator:{
        public_id:email,
        secure_url:'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
    }
});
if(!user){
    return next(new AppError('user registion failed,please try again',400))
}
console.log('File Details > ', JSON.stringify(req.file));
if (req.file) {
    try{
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'LMS',
            width: 250,
            height: 250,
            gravity: 'faces',
            crop: 'fill'
        });

        if(result) {
            user.avatar.public_id = result.public_id;
            user.avatar.secure_url = result.secure_url;

            // Remove file from server
            fs.rm(`uploads/${req.file.filename}`)

        }
    } catch(e) {
        return next(
            new AppError(e || 'File not uploaded, please try again', 500)
        )
    }
}


await user.save();
user.password=undefined;
const token = await user.generateJSONToken();
res.cookie('token',token,cookieOptions);
res.status(200).json({
    success:true,
    message:'user create successfully',
    user,
})

};
const login= async (req,res,next)=>{
  const{ email,password}=req.body;
  if(!email||!password){
    return next(new AppError('all field is required',400));
  }
  const user=await userModel.findOne({email}).select('+password');
  if(!user||!user.comparepassword(password)){
    return next(new AppError('email and password doesnot match',400));
  }
  const token= await user.generateJSONToken();
  user.password=undefined;
  res.cookie('token',token,cookieOptions);
  res.status(200).json({
         success:true,
         message:'user login successfully',
         user,
  })
};
const logout=(req,res)=>{
 res.cookie('token',null,{
  secure:true,
  maxAge:0,
  httpOnly:true
 
 });
 res.status(200).json({
  success:true,
  message:'user logout successfully'
 })
};
const getprofile= async(req,res,next)=>{
  try{
    const userId=req.user.id;
  const user=await userModel.findById(userId);
  res.status(200).json({
    success:true,
    message:'user details',
    user
  })
  }catch(e){
      return next(new AppError('fail to fech the details of user',404));
  }
  


};
export{
    register,
   login,
   logout,
   getprofile
}