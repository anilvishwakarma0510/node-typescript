import express, {Router,Request,Response} from "express"
const route:Router = express.Router();

import * as AuthConroller from "../../Controllers/Admin/AuthConroller"
import * as AdminController from "../../Controllers/Admin/AdminController"
import {AdminAuth} from "../../Middleware/admin-auth";
import * as UserController from "../../Controllers/Admin/UserController";

route.post('/login',AuthConroller.login);
route.post('/signup',AuthConroller.signup);

route.get('/get-admin-detail',AdminAuth,AdminController.GetAdminDetail);

route.post('/add-user',AdminAuth,UserController.AddUser);
route.post('/edit-user',AdminAuth,UserController.EditUser);
route.get('/get-users',AdminAuth,UserController.GetUsers);




export default route;