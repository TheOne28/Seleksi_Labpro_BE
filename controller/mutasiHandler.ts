import { Role, Status, Tipe,  } from "@prisma/client";
import { Request, Response} from "express";
import { statSync } from "fs";
import { convertCurrency } from "../lib/currency";
import { mutasiTransaction, transferTransaction } from "../lib/transaction";
import { PrismaInstance } from "../services/prisma";


export async function verifikasiPendapatanHandler(req: Request<{}, {}, {allId : number[], status : Status[]}, {}>, res: Response){
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

    const allId : number[] = req.body.allId;
    const allStatus : Status[] = req.body.status;

    if(typeof allId === undefined || typeof allStatus === undefined || allId.length !== allStatus.length){
        res.send({
            status: "Error",
            data: "Bad request"
        }).status(400);
        return;
    }


    for(let i = 0; i < allId.length; i ++){
        const id = allId[i];
        const status = allStatus[i];
        
        await mutasiTransaction(id, status)

    }


    res.send({
        status: "Success",
        data : {},
    }).status(200);

}

export function addMutasiHandler(req: Request<{}, {}, 
{
    amount: number,
    currency: string,
    tipe: Tipe
}, {}>, res: Response){
    // @ts-ignore
    const username = req.username;

    //@ts-ignore
    const role = req.role;
    const prisma = PrismaInstance.getInstance().getClient();
    
    if(role === Role.NOTVERIFIED){
        res.send({
            status: "Error",
            data: "Illegal access"
        }).status(403);
        return;
    }

    const amount : number = req.body.amount;
    const currency : string = req.body.currency;
    const tipe: Tipe = req.body.tipe;

    const inRupiah : number = convertCurrency(amount, currency);

    const newUbah = prisma.ubah.create({
        data:{
            amount: inRupiah,
            username : username,
            tipe: tipe
        }
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

export async function addTransferHandler(req: Request<{}, {},
{
    target: string,
    amount: number,
    currency: string,
}, {}>, res: Response){
    // @ts-ignore
    const username = req.username;

    //@ts-ignore
    const role = req.role;
    const prisma = PrismaInstance.getInstance().getClient();
    
    if(role === Role.NOTVERIFIED){
        res.send({
            status: "Error",
            data: "Illegal access"
        }).status(403);
        return;
    }

    const target : string = req.body.target;
    const amount : number = req.body.amount;
    const currency: string = req.body.currency;

    const inRupiah : number = convertCurrency(amount, currency);

    if(target === username){
        res.send({
            status: "Error",
            data: "Bad request",
        }).status(400);
        return;
    }   

    try{
        const newTransfer = await transferTransaction(username, target, inRupiah);
        res.send({
            status: "Success",
            data: newTransfer,
        }).status(200);
        return;
    }catch(err) {
        res.send({
            status: "Error",
            data: err,
        }).status(404);
        return;
    }
}