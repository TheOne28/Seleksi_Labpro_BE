import { Request, Response, NextFunction } from "express";
import {PrismaInstance} from '../services/prisma';
import { verifyToken } from "../lib/jwt";

export async function authentication(req: Request, res: Response, next: NextFunction){
    const authHeader  = req.headers['authorization'];
    
    if(typeof authHeader === undefined){
        res.send({
            status: "Fail",
            data : "Token not verified",
        }).status(401);
    }

    const token = authHeader?.split(' ')[1];

    const user = verifyToken(token as string);

    if(user === null){
        res.send({
            status: "Fail",
            data: "Token not verified"
        }).status(403);
    }else{
        //@ts-ignore
        req.user = user;
        next();
    }
}