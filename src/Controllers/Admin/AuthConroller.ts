import { Request, Response } from "express";
import AdminModel,{IAdmin} from "../../Models/AdminSchema"
import bcrypt from "bcrypt"

export const login = async (req: Request, res: Response) => {

    const { email, password }: { email: string, password: string } = req.body

    if (!email || !password) {
        res.status(400);
        res.json({
            status: 0,
            message: "Invalid Credential"
        })
        return;
    }


    try {

        let Secret : string = String(process.env.JWT_SECRET);


        const response : IAdmin | null = await AdminModel.findOne({email})

        if(!response){
            
            return res.status(401).json({
                status: 0,
                message: 'Invalid Credential',
                data: req.body
            });
        }


        let check :boolean = await bcrypt.compare(password,response.password)

        if(!check){
            return res.status(401).json({
                status: 0,
                message: 'Invalid Credential',
            })
        }

        if(!response.token){
        }
        await response.GenerateJwtToken();


        res.status(200);
        return res.json({
            status: 1,
            message: 'Success',
            data: response,
            token:response?.token
        })




    } catch (error){

        console.log(error)
        res.status(501);
        res.json({
            status: 0,
            message: error
        })

    }

    

}

export const signup = async (req: Request, res: Response) => {

    const { email, password,first_name,last_name }: { email: string, password: string,first_name:string,last_name:string } = req.body

    if (!email || !password || !first_name || !last_name) {
        res.status(400);
        res.json({
            status: 0,
            message: "Invalid Credential"
        })
        return;
    }

    try {

        const check = await AdminModel.find({email})

        if(check.length > 0){
            
            return res.status(403).json({
                status: 0,
                message: 'Email already exist',
                data: req.body
            });
        }

        const newAdmin = new AdminModel({
            email,
            password,
            first_name,
            last_name,
            role:'subadmin'
        })

        const response = await newAdmin.save();

        console.log('response',response);
        

        let token = await response.GenerateJwtToken();

        console.log('token',token);

        res.status(200);
        res.json({
            status: 1,
            message: 'Success',
            data: response,
            token:response.token
        })

    } catch (error) {
        console.log(error)
        res.status(501);
        res.json({
            status: 0,
            message: error
        })
    }



}