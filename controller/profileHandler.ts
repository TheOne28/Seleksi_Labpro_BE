import { Request, Response } from "express";
import { PrismaInstance } from "../services/prisma";
import { Role, User } from "@prisma/client";

export async function profileGetHandler(req: Request, res: Response){
    const prisma = PrismaInstance.getInstance().getClient();
    // * If query is empty, get all user
    if(JSON.stringify(req.query) === '{}'){
        const allUser : User[] = await prisma.user.findMany();
        
        if(allUser === null){
            res.send({
                status: "Error",
                data : "Internal server error"
            }).status(500);
            return;
        }

        res.send({
            status: "Success",
            data: allUser,
        }).status(200);
        return;
    }

    const allUser : User[] = await prisma.user.findMany({
        where: req.query
    })

    if(allUser === null){
        res.send({
            status: "Error",
            data : "Internal server error"
        }).status(500);
        return;
    }

    res.send({
        status: 'Success',
        data : allUser,
    }).status(200);

    return;
}

export async function profilePatchHandler(req: Request, res: Response) {
    //@ts-ignore
    const username = req.username;
    //@ts-ignore
    const role = req.role;
    const prisma = PrismaInstance.getInstance().getClient();

    if(role === Role.NOTVERIFIED){
        res.send({
            status: "Error",
            data : "User not yet verified"
        }).status(403);
        return;
    }

    const newUser : User = await prisma.user.update({
        where: {
            username: username
        },
        data: req.body,
    });

    if(newUser === null){
        res.send({
            status: "Error",
            data : 'Internal server error'
        }).status(500);
        return;
    }

    res.send({
        status: "Success",
        data: newUser
    }).status(200);
    return;
}