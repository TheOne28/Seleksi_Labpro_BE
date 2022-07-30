import { PrismaInstance } from "../services/prisma";

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
    })
}