import { Role, Status,  } from "@prisma/client";
import { Request, Response} from "express";
import { PrismaInstance } from "../services/prisma";

//FIXME
//Implement 

export async function verifikasiPendapatanHandler(req: Request<{}, {}, {allUser : string[], status : Status[]}, {}>, res: Response){
    //@ts-ignore
    const username = req.username;

    //@ts-ignore
    const role = req.role;

    const prisma = PrismaInstance.getInstance().getClient();


    if(role !== Role.ADMIN){
        res.send({
            status: "Error",
            data: "Illegal access"
        }).status(403);
        return;
    }

    const allUser : string[] = req.body.allUser;
    const allStatus : Status[] = req.body.status;

    if(typeof allUser === undefined || typeof allStatus === undefined || allUser.length !== allStatus.length){
        res.send({
            status: "Error",
            data: "Bad request"
        }).status(400);
        return;
    }

    var success = true;

    for(let i = 0; i < allUser.length; i ++){
        const user = allUser[i];
        const status = allStatus[i];
        
        const newUbah = await prisma.ubah.updateMany({
            where: {
                username : user
            },
            data:{
                status : status,
            }
        })

        if(newUbah === null){
            success = false;
        }

    }

    if(!success){
        res.send({
            status: 'Error',
            data: "Internal server error",
        }).status(500);
        return;
    }

    res.send({
        status: "Success",
        data : {},
    }).status(200);

}

export function addMutasiHandler(req: Request, res: Response){
    // @ts-ignore
    const username = req.username;

    const prisma = PrismaInstance.getInstance().getClient();
    const newUbah = prisma.ubah.create({
        data: req.body
    })

    if(newUbah === null){
        res.send({
            status: "Error",
            data : "Internal server error"
        }).status(500);
        return ;
    }

    res.send({
        status: "Success",
        data:newUbah,
    }).status(200);
    return;
}

export function addTransferHandler(req: Request, res: Response){

}