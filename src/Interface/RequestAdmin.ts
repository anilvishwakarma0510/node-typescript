import { IAdmin } from "../Models/AdminSchema";
import { Request } from "express";

export interface AdminRequest extends Request {
    admin?:IAdmin|null
}