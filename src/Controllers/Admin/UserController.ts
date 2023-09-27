import { AdminRequest } from "../../Interface/RequestAdmin";
import { Response } from "express";
import { validationResult } from "express-validator"
import { userRegistrationValidation } from "../../Validations/userValidation";
import { errorResponce, successResponce } from "../../helpers/common";
import * as UserAuthService from "../../Services/Users/UserAuthService"
import CONSTANTS from "../../constants/constants";

export const AddUser = async (req: AdminRequest, res: Response) => {
    try {

        await Promise.all(userRegistrationValidation().map((validaitonRule) => validaitonRule.run(req)))

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return errorResponce(res,CONSTANTS.VALIDATION_ERROR,errors.array())
        }

        const userData = req.body
        const {user,token} = await UserAuthService.UserRegistration(userData)

        
        return successResponce(res,user)

    } catch (error:any) {
        const message:string = error?.message || CONSTANTS.DEFAULT_ERROR
        return errorResponce(res,message)
    }
}

export const EditUser = async (req: AdminRequest, res: Response) => {
    try {
        
        await UserAuthService.UpdateUserService(req)

        return successResponce(res,[],CONSTANTS.USER_UPDATE_MESSAGE)  

    } catch (error:any) {
        const message:string = error?.message || CONSTANTS.DEFAULT_ERROR;
        return errorResponce(res,message)
    }
}

export const GetUsers = async (req:AdminRequest,res:Response) => {
    try {

    const result = await UserAuthService.getUsersService(req);

    const data = {
        users:result.users,
        totalUsers: result.totalUsers,
        totalPages: result.totalPages,
        currentPage: req.query.page || 1,
    }

    return successResponce(res,data)

    } catch(error:any){
        const message:string = error?.message || CONSTANTS.DEFAULT_ERROR;
        return errorResponce(res,message)
    }
}

export const DeleteUser =async (req:AdminRequest,res:Response) => {
    try {
        
        await UserAuthService.DeleteUserService(req.params.id)

        return successResponce(res,[],CONSTANTS.USER_DELETE_MESSAGE)  

    } catch (error:any) {
        const message:string = error?.message || CONSTANTS.DEFAULT_ERROR;
        return errorResponce(res,message)
    }
}
