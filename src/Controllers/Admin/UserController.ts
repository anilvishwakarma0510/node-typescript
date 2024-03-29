import { AdminRequest } from "../../Interface/RequestAdmin";
import AdminModel from "../../Models/AdminSchema";
import UserModel, { IUser } from "../../Models/UserSchema";
import { Response } from "express";

export const AddUser = async (req: AdminRequest, res: Response) => {
    try {

        const { first_name, last_name, email, password,gender }: { first_name: string, last_name: string, email: string, password: string, gender:'male' | 'female' | 'other' }  =  req.body;

        if(!first_name || !last_name || !email || !password ||!gender){
            return res.status(400).json({
                status:0,
                message:'check parameter'
            });
        }

        const check = await UserModel.findOne({email});

        if(check){
            return res.status(400).json({
                status:0,
                message:'Email already exist'
            });  
        }

        const NewUser = new UserModel({
            first_name,
            last_name,
            email,
            password,
            gender
        });

        const user = await NewUser.save();

        return res.status(200).json({
            status:1,
            message:'User has been created successfully',
            data:user
        });  

    } catch (error:any) {
        console.log("🚀 ~ file: UserController.ts:9 ~ AddUser ~ error:", error)
        return res.status(500).json({
            status: 0,
            message: (error?._message) ? error?._message : 'Something went wrong',
            errors: (error?.errors) ? error?.errors : {}
        })
    }
}

export const EditUser = async (req: AdminRequest, res: Response) => {
    try {

        const { id, first_name, last_name, email, password,gender }: { id:string, first_name: string, last_name: string, email: string, password: string, gender:'male' | 'female' | 'other' }  =  req.body;

        if(!id || !first_name || !last_name || !email || !password || !gender){
            return res.status(400).json({
                status:0,
                message:'check parameter'
            });
        }

        const check = await UserModel.exists({email:email,_id:{$ne:id}});

        if(check){
            return res.status(400).json({
                status:0,
                message:'Email already exist'
            });  
        }

        const user = await UserModel.findOne({_id:id});

        if(!user){
            return res.status(400).json({
                status:0,
                message:'Email already exist'
            });  
        }

      
        if(password){
            user.password = password;
        }

        if(first_name){
            user.first_name = first_name;
        }

        if(email){
            user.email = email;
        }

        if(last_name){
            user.last_name = last_name;
        }

        if(gender){
            user.gender = gender;
        }
        user.save();

        return res.status(200).json({
            status:1,
            message:'User has been updated successfully'
        });  

    } catch (error:any) {
        console.log("🚀 ~ file: UserController.ts:9 ~ AddUser ~ error:", error)
        return res.status(500).json({
            status: 0,
            message: (error?._message) ? error?._message : 'Something went wrong',
            errors: (error?.errors) ? error?.errors : {}
        })
    }
}

export const GetUsers = async (req:AdminRequest,res:Response) => {
    try {

        const page:number = parseInt(req.query.page as string) || 1;
        const limit:number = parseInt(req.query.limit as string) || 2;
        const sortBy:string = req.query.sortBy as string || 'createdAt';
        const sortOrder:string = req.query.sortOrder as string || 'desc';
        

        const gender:string = req.query.gender as string || "";
        const keywords:string = req.query.keywords as string || "";

        const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
        const skip:number = (page-1) * limit

        const query:any = QueryBuilder({
            gender,
            keywords
        });
        const totalUsers:number = await UserModel.countDocuments(query);
        const totalPages:number = Math.ceil(totalUsers/limit);
        const users:IUser[] = await UserModel.find(query)
                .setOptions(sortOptions)
                .skip(skip)
                .limit(limit);

        return res.status(200).json({
            status:1,
            message:'success',
            totalUsers:totalUsers,
            totalPages:totalPages,
            currentPage:page,
            data:users
        })

    } catch(error:any){
        console.log("🚀 ~ file: UserController.ts:55 ~ GetUser ~ error:", error)
        return res.status(400).json({
            status:0,
            message:(error?._message) ? error?._message : 'Something went wrong, try again later',
            errors:(error?.errors) ? error?.errors : {}
        })
    }
}

export const DeleteUser =async (req:AdminRequest,res:Response) => {
   try {

    const userId: any = req.query.id;

    if(!userId){
        return res.status(400).json({
            status:0,
            message:'check parameter'
        }); 
    }

    const user:IUser | null = await UserModel.findById(userId);
    //console.log("🚀 ~ file: UserController.ts:177 ~ DeleteUser ~ user:", user)
    


    await UserModel.findByIdAndDelete(userId);

    return res.status(200).json({
        status: 1,
        message: 'User has been deleted successfully',
      });

   } catch(error:any){
        return res.status(500).json({
            status: 0,
            message: (error?._message) ? error?._message : 'Something went wrong',
            errors: (error?.errors) ? error?.errors : {}
        });
   }
}
const QueryBuilder = (req:any) => {
    
    const query : any = {};
    if(req.gender){
        query.gender = req.gender;
    }

    if(req.keywords){
        const regex = new RegExp(req.keywords,"i");
        query.$or = [
            {first_name:{$regex:regex}},
            {last_name:{$regex:regex}},
            {email:{$regex:regex}},
            {gender:{$regex:regex}}
        ]
    }
    return query;
}