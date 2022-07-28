import { Role, Transfer, Ubah } from "@prisma/client";
import { Request, Response } from "express";
import { PrismaInstance } from "../services/prisma";


export async function historyGetHandler(req: Request, res: Response) {
    const prisma = PrismaInstance.getInstance().getClient();

    //@ts-ignore
    const username = req.username;
    //@ts-ignore
    const role = req.role;

    if(role === Role.NOTVERIFIED){
        res.send({
            status: "Error",
            data : "User not yet verified"
        }).status(403);
        return;
    }

    const allTransfer : Transfer[] = await prisma.transfer.findMany({
        where:{
            OR: [{
                    usernameDest : username,
                },{
                    usernameSrc : username,
                }
            ]
        }
    })

    const allUbah : Ubah[] = await prisma.ubah.findMany({
        where : {
            username : username,
        }
    })

    //FIXME 
    // ! Fix kasus error prisma, harusnya bukan null
    if(allUbah === null || allTransfer === null){
        res.send({
            status: "Error",
            data : 'Internal server error'
        }).status(500);
        return;
    }

    res.send({
        status: "Success",
        data: {
            transfer : allTransfer,
            ubah : allUbah,
        }
    }).status(200);
    return;
    
    
}