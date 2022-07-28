import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

export function authentication(req: Request, res: Response, next: NextFunction){
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
        req.user = user.username;
        //@ts-ignore
        req.role = user.role;
        next();
    }
}