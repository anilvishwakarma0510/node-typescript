import { Request,Response } from "express";

export const login = async (req:Request,res:Response) => {

    const {email,password} : {email:string,password:string} = req.body

    if(!email || !password){
        res.status(400);
        res.json({
            status:0,
            message:"Invalid Credential"
        })
        return;
    }

    res.status(200);
    res.json({
        status:1,
        message:'Success',
        data:req.body
    })

}