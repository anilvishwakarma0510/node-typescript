import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateAdmin, GetAdminByEmail } from "../../Repository/admin/adminAuthRepository";
import { IAdmin } from "../../Models/AdminSchema";
import CONSTANTS from "../../constants/constants";
const jwtSecret = process.env.JWT_SECRET || '';

export const GenerateJwtToken = async (admin: IAdmin): Promise<string> => {
    const token = jwt.sign({ _id: admin._id, email: admin.email }, jwtSecret);
    admin.token = token;
    await admin.save();
    return token;
}

export const AdminLogin = async (email: string, password: string): Promise<{ admin: IAdmin, token: string }> => {

    const admin: IAdmin | null = await GetAdminByEmail(email);
    if (!admin) {
        throw new Error(CONSTANTS.INVALID_CREDENTIALS);
    }

    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) {
        throw new Error(CONSTANTS.INVALID_CREDENTIALS);
    }

    const token = admin.token || (await (GenerateJwtToken(admin)));

    return {
        admin,
        token
    }

}

export const AdminRegistration = async (adminData: IAdmin): Promise<{ admin: IAdmin, token: string }> => {

    const check = await GetAdminByEmail(adminData.email)

    if (check) {
        throw new Error(CONSTANTS.EMAIL_EXIST)
    }


    const admin = await CreateAdmin(adminData);

    const token = admin.token || (await GenerateJwtToken(admin))

    return { admin, token };
}