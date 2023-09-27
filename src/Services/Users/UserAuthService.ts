import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request } from "express";
import { CreateUser, DeleteUser, DoesEmailExistForOtherUser, GetUserByEmail, GetUserById, GetUsers, UpdateUser } from "../../Repository/userRepository";
import { IUser } from "../../Models/UserSchema";
import { GenderInterface } from "../../Interface/Common";
import CONSTANTS from "../../constants/constants";
const jwtSecret = process.env.JWT_SECRET || '';

export const GenerateUserAuthToken =async (user:IUser):Promise<string> => {
    const token = await jwt.sign({_id:user._id,email:user.email},jwtSecret);
    user.token = token;
    await user.save();
    return token;
}

export const UserLogin = async (email: string, password: string): Promise<{ user: IUser, token: string }> => {

    const user: IUser | null = await GetUserByEmail(email);
    if (!user) {
        throw new Error(CONSTANTS.EMAIL_EXIST);
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
        throw new Error(CONSTANTS.EMAIL_EXIST);
    }

    const token = user.token || (await (GenerateUserAuthToken(user)));

    return {
        user,
        token
    }

}

export const UpdateUserService =async (req:Request) : Promise<void> => {
    const { id, first_name, last_name, email, password,gender }: { id:string, first_name: string, last_name: string, email: string, password: string, gender:GenderInterface }  =  req.body;

    const user = await GetUserById(id);
    if (!user) {
        throw new Error(CONSTANTS.USER_NOT_FOUND);
    }

    if(email){
        const checkEmail:IUser|null = await DoesEmailExistForOtherUser(id,email);
        if(checkEmail){
            throw new Error(CONSTANTS.EMAIL_EXIST)
        }
    }

    const update:Partial<IUser> = {}
    if(first_name) update.first_name = first_name;
    if(last_name) update.last_name = last_name;
    if(email) update.email = email;
    if(gender) update.gender = gender;
    if(password) update.password = password;

    if(Object.keys(update).length > 0){
        await UpdateUser(id,update)
    }

}

export const DeleteUserService =async (_id:string) : Promise<void> => {

    const user = await GetUserById(_id);
    if (!user) {
        throw new Error(CONSTANTS.USER_NOT_FOUND);
    }

    await DeleteUser(_id);

}

export const getUsersService = async (req: Request): Promise<{ totalUsers: number; totalPages: number; users: IUser[] }> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';
    const gender = req.query.gender as string || '';
    const keywords = req.query.keywords as string || '';
  
    return await GetUsers(page, limit, sortBy, sortOrder, gender, keywords);
  };

export const UserRegistration = async (userData: IUser): Promise<{ user: IUser, token: string }> => {

    const check = await GetUserByEmail(userData.email)

    if (check) {
        throw new Error(CONSTANTS.EMAIL_EXIST)
    }


    const user = await CreateUser(userData);

    const token = user.token || (await GenerateUserAuthToken(user))

    return { user, token };
}