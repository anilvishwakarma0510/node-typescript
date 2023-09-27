import { Response } from "express";
import CONSTANTS from "../constants/constants";

export const successResponce = (res:Response,data:any,message:string=CONSTANTS.SUCCESS,status:number=200) => {
    return res.status(200).json({
        status:1,
        message,
        data
    }) 
}

export const errorResponce = (res:Response,message:string=CONSTANTS.ERROR,errors:any=[],status:number=400) => {
    return res.status(status).json({
        status:0,
        message,
        errors
    }) 
}