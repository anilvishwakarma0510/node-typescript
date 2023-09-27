import UserModel,{IUser} from "../Models/UserSchema";
import {  searchUserQuery } from "../utils/queryBuilder";

export const GetUserById = async (_id:string) : Promise<IUser | null> => {
    return await UserModel.findOne({_id})
}

export const GetUserByEmail = async (email:string) : Promise<IUser | null> => {
    return await UserModel.findOne({email})
}

export const DoesEmailExistForOtherUser = async (_id:string, email:string) : Promise<IUser | null> => {
    return await UserModel.findOne({email,_id : { $ne : _id }})
}

export const UpdateUser = async (_id:string,data:Partial<IUser>) : Promise<void>=>{
    await UserModel.findByIdAndUpdate(_id,data);
}

export const DeleteUser = async (_id:string) : Promise<void>=>{
    await UserModel.findByIdAndDelete(_id);
}

export const GetUsers = async (page: number, limit: number, sortBy: string, sortOrder: string, gender: string, keywords: string) : Promise<{totalUsers:number,totalPages:number,users:IUser[]}>=>{
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  const skip = (page - 1) * limit;

  const query = searchUserQuery({ gender, keywords });

  const totalUsers = await UserModel.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);
  const users = await UserModel.find(query)
    .setOptions(sortOptions)
    .skip(skip)
    .limit(limit);

  return { totalUsers, totalPages, users }; 
}

export const CreateUser = async (userData:IUser) => {
    const newUser = new UserModel(userData)
    return await newUser.save();
}