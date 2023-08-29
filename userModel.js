import {model,Schema}from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const userschema=new Schema({
    fullName:{
        type:String,
        required:[true,'name is required'],
        trim:true,
        minLength:[5,'charter is greater than 5'],
        maxLength:[20,'char is less than 10']
    },
    email:{
        type:String,
        required:[true,'email is required'],
        trim:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,'password is required'],
        minLength:[9,'password is greather than 9'],
        select:false
    },
    avator:{
        public_id:{
            type:String
        },
        secure_url:{
            type:String
        }
    },
    forgotpasswordtoken:{
        type:String
    },
    forgotpasswordexpiry:{
        type:Date
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    }

    
},{
    timestamps:true
});
userschema.pre('save', async function(next){
    if(!this.isModified('password')){
        return  next();
    }
    this.password= await bcrypt.hash(this.password,10);
});
userschema.methods={
    generateJSONToken: async function(){
             return await jwt.sign(
        {
            id:this.id,email:this.email,subsciption:this.subscription,role:this.role},
            process.env.JWT_SECRET,
            {
               expiresIn:process.env.JWT_EXPIRY 
            }


     );
    },
    comparepassword: async function(plaintextpassword){
        return await bcrypt.compare(plaintextpassword,this.password);
    }
}

const userModel=model('user',userschema)
export default userModel;