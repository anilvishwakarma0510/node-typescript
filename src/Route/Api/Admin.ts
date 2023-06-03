import express, {Router,Request,Response} from "express"
const route:Router = express.Router();

import * as Auth from "../../Controllers/Admin/Auth"

route.post('/login',Auth.login);
route.post('/signup',Auth.signup);

export default route;