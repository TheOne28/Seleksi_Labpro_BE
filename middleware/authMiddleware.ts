import { Request, Response, NextFunction } from "express";
import {PrismaInstance} from '../services/prisma';
import { Role, User } from "@prisma/client";
import { verifyPassword } from "../lib/hash";

export async function authentication(req: Request, res: Response, next: NextFunction){
    const username = req.body.username;
    const password = req.body.username;
    const prisma = PrismaInstance.getInstance().getClient();

    const user : User | null = await prisma.user.findUnique({
        where:{
            username: username
        }
    })

    if(user === null){
        res.send({
            data: "User not yet registered"
        }).status(404);
        return;
    }else{
        const hashPassword: string = user.password;

        const same : boolean= await verifyPassword(password, hashPassword);
        
        if(same){
            // @ts-ignore
            req.userRole = user.role;
            next();
        }else{
            res.send({
                data: "Wrong password"
            }).status(401);
            return;
        }
    }
}