import { Status, Tipe } from "@prisma/client";
import { statSync } from "fs";
import { PrismaInstance } from "../services/prisma";
import { convertCurrency } from "./currency";

export async function transferTransaction(src: string, dest: string, amount: number) {
    const prisma = PrismaInstance.getInstance().getClient();

    return await prisma.$transaction(async(prisma) => {
        //Check if recipient account exist
        const recipient = await prisma.user.findUnique({
            where:{
                username : dest,
            }
        })

        if(recipient === null){
            throw new Error(`There is no existing account with username ${dest}`);
        }

        //Decrement sender's balance and make sure sender's have enough balance
        const newSender = await prisma.user.update({
            data: {
                saldo:{
                    decrement : amount
                }
            },
            where:{
                username : src
            }
        })

        if(newSender.saldo < 0){
            throw new Error(`${src} doesn't have enough saldo to sent ${amount} rupiah`)
        }

        //Increment recipient balance 
        const newRecipient = await prisma.user.update({
            data:{
                saldo:{
                    increment: amount,
                }
            },
            where:{
                username: dest
            }
        })

        //Add new transfer record

        const newTransfer = await prisma.transfer.create({
            data:{
                usernameSrc: src,
                usernameDest: dest,
                amount: amount,
            }
        })

        return newTransfer
    },{
        maxWait: 5000,
        timeout: 10000,
    })
}

export async function mutasiTransaction(idUbah: number, status: Status) {
    const prisma = PrismaInstance.getInstance().getClient();

    return await prisma.$transaction(async(prisma) => {
        const newUbah = await prisma.ubah.update({
            data: {
                status: status,
            },
            where:{
                idUbah : idUbah
            }
        })


        if(status == Status.REJECTED){
            return [newUbah, null]
        }

        var newUser;
        if( newUbah.tipe == Tipe.PENAMBAHAN){
            newUser = await prisma.user.update({
                data:{
                    saldo:{
                        increment: newUbah.amount,
                    }
                },where:{
                    username : newUbah.username
                }
            })
        }else{
            newUser = await prisma.user.update({
                data: {
                    saldo: {
                        decrement: newUbah.amount,
                    }
                }, where:{
                    username :  newUbah.username,
                }
            })
        }
        return [newUbah, newUser]
    })

} 