import { Request, Response } from "express";
import { IAdmin } from "../../Models/AdminSchema";
import { AdminRequest } from "../../Interface/RequestAdmin";
import CONSTANTS from "../../constants/constants";
import { errorResponce, successResponce } from "../../helpers/common";

export const GetAdminDetail = (req: AdminRequest, res: Response) => {
    try {

        return successResponce(res,req.admin)
        
    } catch (error:any) {
        const message:string = error?.message || CONSTANTS.DEFAULT_ERROR;
        return errorResponce(res,message)

    }

}