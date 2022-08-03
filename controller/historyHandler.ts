import { Role, Transfer, Ubah } from "@prisma/client";
import { Request, Response } from "express";
import { PrismaInstance } from "../services/prisma";


export async function historyGetHandler(req: Request, res: Response) {
    const prisma = PrismaInstance.getInstance().getClient();

    //@ts-ignore
    const username = res.locals.username;
    //@ts-ignore
    const role = res.locals.role;

    if(role === Role.NOTVERIFIED){
        res.status(403);
        res.send({
            status: "Error",
            data : "User not yet verified"
        })
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
        data: {
            transfer : allTransfer,
            ubah : allUbah,
        }
    })
    return;
    
    
}