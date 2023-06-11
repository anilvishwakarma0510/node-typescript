import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import AdminModel, {IAdmin} from "../Models/AdminSchema";
import { AdminRequest } from "../Interface/RequestAdmin";
config();

export const AdminAuth = async (req:AdminRequest,res:Response,next:NextFunction) =>{
    const authHearder = req.headers;
    const token = authHearder?.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({
            status:0,
            message:'Unauthorized'
        });
    }

    try{

        const sercret:string = String(process.env.JWT_SECRET);

        const decodeToken:any = jwt.verify(token,sercret);
        //console.log("🚀 ~ file: admin-auth.ts:24 ~ AdminAuth ~ decodeToken:", decodeToken);

        const admin:IAdmin | null = await AdminModel.findById(decodeToken.id);

        if(!admin || admin.token !== token){
            return res.status(401).json({
                status:0,
                message:'Unauthorized'
            })
        }

        req.admin = admin;
        

        next();
    } catch (error){
        console.log("🚀 ~ file: admin-auth.ts:22 ~ AdminAuth ~ error:", error)
        return res.status(401).json({
            status:0,
            message:'Unauthorized'
        })
       
    }

    
}