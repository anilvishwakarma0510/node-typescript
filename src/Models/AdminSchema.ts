import mongoose, {Schema} from "mongoose";
import * as jwt from "jsonwebtoken";
import bcypt from "bcrypt";

const AdminSchema:Schema = new mongoose.Schema({
    first_name:{
        type:String,
        require:true,
    },
    last_name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true
    },
    token:{
        type:String
    }
},{
    timestamps:true
});

AdminSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcypt.hash(this.password,12)
    }
    next()
});

AdminSchema.methods.GenerateJwtToken  = async function () {
    try{
        let token = await jwt.sign({id:this.id,email:this.email},'MyAdminSecretNot@123');
        this.token = token;
        await this.save();
        return token;

    } catch (error) {
        console.log("🚀 ~ file: AdminSchema.ts:41 ~ error:", error)
        return false
    }
}

const AdminModel = mongoose.model('admin',AdminSchema);
module.exports = AdminModel;

