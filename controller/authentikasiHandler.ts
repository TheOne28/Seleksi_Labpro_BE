import { Request, Response} from "express";
import {generatePassword, verifyPassword} from "../lib/hash";
import {PrismaInstance} from '../services/prisma';
import {Role, User } from "@prisma/client";

export async function loginHandler(req: Request<{}, {}, {password : string}, {username: 'string'}>, res: Response){
    const username : string = req.query.username;
    const password : string = req.body.password; 
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
        if(user.role === Role.NOTVERIFIED){
            res.send({
                data: "User not yet verified"
            }).status(403);
            return;
        }

        const hashPassword: string = user.password;

        const same : boolean= await verifyPassword(password, hashPassword);
        
        if(same){
            res.send({
                data: "Success"
            }).status(200);
            return;
        }else{
            res.send({
                data: "Wrong password"
            }).status(401);
            return;
        }
    }
}

export async function registerHandler(req: Request<{}, {}, 
    {
        username: string,
        name : string,
        password: string,
        linkKtp : string,
        fotoKtp: string,
}, {}>, res: Response){
    const username : string = req.body.username;
    const name : string = req.body.name;
    const password : string = req.body.password;
    const linkKtp : string = req.body.linkKtp;
    const fotoKtp : string = req.body.fotoKtp;
    const prisma = PrismaInstance.getInstance().getClient();


    const hashPassword : string = await generatePassword(password);

    const user = await prisma.user.create({
        data:{
            username: username,
            name: name,
            password: hashPassword,
            linkKTP: linkKtp,
            fotoKTP: fotoKtp,
        }
    })

    if(user === null){
        res.send({
            data : "internal server error"
        }).status(500);
        return;
    }

    res.send({
        data : "Success"
    }).status(200);
    return;

}

export async function verifyUserHandler(req: Request<{}, {}, {allUser : string[], role: Role[]}, {}>, res: Response){
    //@ts-ignore
    const role = req.userRole;
    const prisma = PrismaInstance.getInstance().getClient();

    if(role !== Role.ADMIN){
        res.send({
            data : "User don't have access"
        }).status(403);
        return
    }

    const alluser : string[] = req.body.allUser;
    const allrole : Role[] = req.body.role;
    var success = true;

    for(let i = 0; i < alluser.length; i ++){
        const user = alluser[i];
        const role = allrole[i];
        
        const newUser = await prisma.user.update({
            where: {
                username : user
            },
            data:{
                role : role,
            }
        })

        if(newUser === null){
            success = false;
        }

    }

    if(!success){
        res.send({
            data: "Internal server error",
        }).status(500);
        return;
    }

    res.send({
        data: "Success"
    }).status(200);
}