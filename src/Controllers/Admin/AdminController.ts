import { Request, Response } from "express";
import { IAdmin } from "../../Models/AdminSchema";
import { AdminRequest } from "../../Interface/RequestAdmin";

export const GetAdminDetail = (req: AdminRequest, res: Response) => {
    try {
        
        return res.status(200).json({
            status: 1,
            message: 'Succes',
            admin:req.admin
        });


    } catch (error) {
        console.log('error',error)
        return res.status(500).json({
            status: 0,
            message: 'Something went wrong, try again later',
            //error:error?.message
        });

    }

}