import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export interface IUser extends Document {
    first_name: string;
    last_name: string;
    email: string;
    gender:"mail"|"femail"|"other";
    password: string;
    token?: string;
    GenerateJwtToken: () => Promise<string | boolean>
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
        enum: ['male','femail','gender']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
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

UserSchema.methods.GenerateJwtToken = async function () {
    try {
        const Secret:string = String(process.env.JWT_SECRET);
        console.log("🚀 ~ file: UserSchema.ts:48 ~ Secret:", Secret)
        let token = await jwt.sign({id:this.id,email:this.email},Secret);
        this.token = token;
        await this.token;
        return token;
    } catch (error){
        console.log("🚀 ~ file: UserSchema.ts:49 ~ error:", error)
        return false;
    }
}

const UserModel = mongoose.model<IUser>('users',UserSchema,'users');
export default UserModel

