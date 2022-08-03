import { PrismaClient, Role } from "@prisma/client";
import { generatePassword } from "../lib/hash";

const prisma = new PrismaClient();

async function main(){
    // const deleteU = await prisma.user.deleteMany({});
    const password1 = await generatePassword("customer1");
    const customer1 = await prisma.user.create({
        data:{
            username: "c1",
            password : password1,
            name : "Customer 1",
            fotoKTP: "",
            linkKTP: "",
            role: Role.CUSTOMER
        }
    })
    const password2 = await generatePassword("customer2");
    const customer2 = await prisma.user.create({
        data:{
            username: "c2",
            password : password2,
            name : "Customer 2",
            fotoKTP: "",
            linkKTP: "",
            role: Role.CUSTOMER,
        }
    })

    const password3 = await generatePassword("admin");
    const customer3 = await prisma.user.create({
        data:{
            username: "admin",
            password : password3,
            name : "Admin",
            fotoKTP: "",
            linkKTP: "",
            role: Role.ADMIN,
        }
    })

    const password4 = await generatePassword("un1");
    const unverified1 = await prisma.user.create({
        data:{
            username: "unverified1",
            password : password4,
            name : "Unverified",
            fotoKTP: "",
            linkKTP: "",
            role: Role.NOTVERIFIED,
        }
    })
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})