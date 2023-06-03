import mongoose, {Schema, Document} from "mongoose";
import * as jwt from "jsonwebtoken";
import bcypt from "bcrypt";
import {config} from "dotenv";
config()

export interface IAdmin extends Document {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    token?: string;
    GenerateJwtToken: () => Promise<string | boolean>;
  }

const AdminSchema:Schema<IAdmin> = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String
    }
},{
    timestamps:true
});

AdminSchema.pre<IAdmin>('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcypt.hash(this.password,12)
    }
    next()
});

AdminSchema.methods.GenerateJwtToken  = async function () {
    try{
        let Secret : string = String(process.env.JWT_SECRET);
        let token = await jwt.sign({id:this.id,email:this.email},Secret);
        this.token = token;
        await this.save();
        return token;

    } catch (error) {
        console.log("🚀 ~ file: AdminSchema.ts:41 ~ error:", error)
        return false
    }
}

const AdminModel = mongoose.model<IAdmin>("admin", AdminSchema, "admin")
export default AdminModel;

