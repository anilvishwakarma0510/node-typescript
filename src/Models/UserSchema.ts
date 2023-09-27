import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken"
import { GenderInterface } from "../Interface/Common";

export interface IUser extends Document {
    first_name: string;
    last_name: string;
    email: string;
    gender:GenderInterface;
    password: string;
    token?: string;
    user_type:string;
    // GenerateJwtToken: () => Promise<string | boolean>
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male','female','other']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    user_type: {
        type: String,
        required: true,
        enum:[
            'customer',
            'seller'
        ]
    },
    token: {
        type: String
    }
}, {
    timestamps: true
});

UserSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12)
    }
})

// UserSchema.methods.GenerateJwtToken = async function () {
//     try {
//         const Secret:string = String(process.env.JWT_SECRET);
//         let token = await jwt.sign({id:this.id,email:this.email},Secret);
//         this.token = token;
//         await this.token;
//         return token;
//     } catch (error){
//         console.log("🚀 ~ file: UserSchema.ts:49 ~ error:", error)
//         return false;
//     }
// }

const UserModel = mongoose.model<IUser>('users',UserSchema,'users');
export default UserModel

