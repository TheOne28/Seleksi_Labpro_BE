import { Request, Response } from "express";
import { PrismaInstance } from "../services/prisma";
import { Role, User } from "@prisma/client";

export async function profileGetHandler(req: Request, res: Response){
    const prisma = PrismaInstance.getInstance().getClient();
    // * If query is empty, get all user
    if(JSON.stringify(req.query) === '{}'){
        const allUser : User[] = await prisma.user.findMany();
        
        if(allUser === null){
            res.status(500);
            res.send({
                status: "Error",
                data : "Internal server error"
            })
            return;
        }

        res.status(200);
        res.send({
            status: "Success",
            data: allUser,
        })
        return;
    }

    const allUser : User[] = await prisma.user.findMany({
        where: req.query
    })

    //FIXME 
    // ! Fix kasus error prisma, harusnya bukan null
    if(allUser === null){
        res.status(500);
        res.send({
            status: "Error",
            data : "Internal server error"
        })
        return;
    }

    res.status(200);
    res.send({
        status: 'Success',
        data : allUser,
    })

    return;
}

export async function profilePatchHandler(req: Request, res: Response) {
    //@ts-ignore
    const username = res.locals.username;
    //@ts-ignore
    const role = req.locals.role;
    const prisma = PrismaInstance.getInstance().getClient();

    if(role === Role.NOTVERIFIED){
        res.status(403);
        res.send({
            status: "Error",
            data : "User not yet verified"
        })
        return;
    }

    const newUser : User = await prisma.user.update({
        where: {
            username: username
        },
        data: req.body,
    });

    //FIXME 
    // ! Fix kasus error prisma, harusnya bukan null
    if(newUser === null){
        res.status(500);
        res.send({
            status: "Error",
            data : 'Internal server error'
        })
        return;
    }

    res.status(200);
    res.send({
        status: "Success",
        data: newUser
    })
    return;
}