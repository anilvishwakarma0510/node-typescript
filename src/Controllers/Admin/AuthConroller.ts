import { Request, Response } from "express";
import { validationResult } from "express-validator"
import { adminLoginValidation, adminRegistrationValidation } from "../../Validations/adminAuth";
import * as AdminAuthService from "../../Services/Admin/AdminAuthService"
import { errorResponce, successResponce } from "../../helpers/common";
import CONSTANTS from "../../constants/constants";

export const login = async (req: Request, res: Response) => {

    try {

        await Promise.all(adminLoginValidation().map((validaitonRule) => validaitonRule.run(req)))

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return errorResponce(res,CONSTANTS.VALIDATION_ERROR,errors.array())
        }

        const { email, password }: { email: string, password: string } = req.body

        const { admin } = await AdminAuthService.AdminLogin(email, password);


        return successResponce(res,admin);


    } catch (error:any) {
        const message : string = error?.message || CONSTANTS.DEFAULT_ERROR;
        //console.log(message)
        errorResponce(res,message)

    }

}

export const signup = async (req: Request, res: Response) => {
    try {

        await Promise.all(adminRegistrationValidation().map((validationRule) => validationRule.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponce(res,CONSTANTS.VALIDATION_ERROR,errors.array())
        }
        const adminData = req.body;
        const {admin,token} = await AdminAuthService.AdminRegistration(adminData)

        
        return successResponce(res,admin);

    } catch (error:any) {
        const message : string = error?.message || CONSTANTS.DEFAULT_ERROR;
        //console.log(message)
        return errorResponce(res,message)
    }



}