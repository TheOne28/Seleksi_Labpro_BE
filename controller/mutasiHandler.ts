import { Role, Status, Tipe,  } from "@prisma/client";
import { Request, Response} from "express";
import { getCache } from "../lib/cache";
import { convertCurrency } from "../lib/currency";
import { mutasiTransaction, transferTransaction } from "../lib/transaction";
import { PrismaInstance } from "../services/prisma";


export async function verifikasiPendapatanHandler(req: Request<{}, {}, {allId : number[], status : Status[]}, {}>, res: Response){
    //@ts-ignore
    const username = res.locals.username;

    //@ts-ignore
    const role = res.locals.role;

    if(role !== Role.ADMIN){
        res.status(403);
        res.send({
            status: "Error",
            data: "Illegal access"
        })
        return;
    }

    const allId : number[] = req.body.allId;
    const allStatus : Status[] = req.body.status;

    if(typeof allId === undefined || typeof allStatus === undefined || allId.length !== allStatus.length){
        res.status(400);
        res.send({
            status: "Error",
            data: "Bad request"
        })
        return;
    }


    for(let i = 0; i < allId.length; i ++){
        const id = allId[i];
        const status = allStatus[i];
        
        await mutasiTransaction(id, status)

    }

    res.status(200);
    res.send({
        status: "Success",
        data : {},
    })

}

export async function addMutasiHandler(req: Request<{}, {}, 
{
    amount: number,
    currency: string,
    tipe: Tipe
}, {}>, res: Response){
    // @ts-ignore
    const username = res.locals.username;

    //@ts-ignore
    const role = req.locals.role;
    const prisma = PrismaInstance.getInstance().getClient();
    
    if(role === Role.NOTVERIFIED){
        res.status(403);
        res.send({
            status: "Error",
            data: "Illegal access"
        })
        return;
    }

    const amount : number = req.body.amount;
    const currency : string = req.body.currency;
    const tipe: Tipe = req.body.tipe;

    const inRupiah : number = await convertCurrency(amount, currency);

    const newUbah = prisma.ubah.create({
        data:{
            amount: inRupiah,
            username : username,
            tipe: tipe
        }
    })

    if(newUbah === null){
        res.status(500);
        res.send({
            status: "Error",
            data : "Internal server error"
        })
        return ;
    }

    res.status(200);
    res.send({
        status: "Success",
        data:newUbah,
    })
    return;
}

export async function addTransferHandler(req: Request<{}, {},
{
    target: string,
    amount: number,
    currency: string,
}, {}>, res: Response){
    // @ts-ignore
    const username = res.locals.username;

    //@ts-ignore
    const role = res.locals.role;
    const prisma = PrismaInstance.getInstance().getClient();
    
    if(role === Role.NOTVERIFIED){
        res.status(403);
        res.send({
            status: "Error",
            data: "Illegal access"
        })
        return;
    }

    const target : string = req.body.target;
    const amount : number = req.body.amount;
    const currency: string = req.body.currency;

    const inRupiah : number = await convertCurrency(amount, currency);
    if(target === username){
        res.status(400);
        res.send({
            status: "Error",
            data: "Bad request",
        })
        return;
    }   

    try{
        console.log(inRupiah);
        const newTransfer = await transferTransaction(username, target, inRupiah);
        res.status(200);
        res.send({
            status: "Success",
            data: newTransfer,
        })
        return;
    }catch(err) {
        res.status(400);
        res.send({
            status: "Error",
            data: err,
        })
        return;
    }
}

export async function getCurrencyHanddler(req: Request, res: Response){
    const currency = await getCache("getid");

    res.status(200);
    res.send({
        status: "Success",
        data: currency,
    })
}