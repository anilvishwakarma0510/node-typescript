
import express, { Request, Response, NextFunction, Application, ErrorRequestHandler ,Router } from "express";
import { Server } from "http"
import createHttpError from "http-errors";
import { config } from "dotenv";
import bodyParser = require("body-parser");
import path = require("path");
import connection from "./database/mongo"
config();
connection();



const app: Application = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const AdminRouter:Router = require(path.join(__dirname,"./Route/Api/Admin")).default;
app.use('/api/admin',AdminRouter);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hi Anil');
});

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new createHttpError.NotFound());
})

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        status: err.status | 500,
        message: err.message
    })
}
app.use(errorHandler)
const PORT: Number = Number(process.env.PORT) || 4000
const server: Server = app.listen(PORT, () => {

    /*if(!error){
        console.log("🚀 ~ file: index.ts:13 ~ app.listen ~ error:", error)
    }*/
    console.log("🚀 Server is running or ", PORT)
})

