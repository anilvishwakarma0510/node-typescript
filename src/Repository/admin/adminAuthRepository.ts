import AdminModel,{IAdmin} from "../../Models/AdminSchema";

export const GetAdminByEmail = async (email:string) : Promise<IAdmin | null> => {
    return await AdminModel.findOne({email})
}

export const CreateAdmin = async (adminData:IAdmin) => {
    const newAdmin = new AdminModel(adminData)
    return await newAdmin.save();
}