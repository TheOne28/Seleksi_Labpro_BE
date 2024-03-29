import { Request, Response} from "express";
import {generatePassword, verifyPassword} from "../lib/hash";
import {PrismaInstance} from '../services/prisma';
import {Role, User } from "@prisma/client";
import { generateToken } from "../lib/jwt";

export async function loginHandler(req: Request<{}, {}, {}, {username : string, password: string}>, res: Response){
    const username : string = req.query.username;
    const password : string = req.query.password; 
    const prisma = PrismaInstance.getInstance().getClient();
    
    if(username === undefined ||password === undefined){
        res.status(400);    
        res.send({
            status: "Error",
            data: "Bad request"
        })
        return;
    }
    const user : User | null = await prisma.user.findUnique({
        where:{
            username: username
        }
    })

    if(user === null){
        res.status(404);
        res.send({
            status: "Error",
            data: "Username not yet registered"
        }).status(404);
        return;
    }else{
        if(user.role === Role.NOTVERIFIED){
            res.status(403);
            res.send({
                status: "Error",
                data: "User account not yet verified"
            })
            return;
        }

        const hashPassword: string = user.password;
        const same : boolean= await verifyPassword(password, hashPassword);
        
        if(same){
            const token = generateToken(user.username, user.role);
            res.send({
                status: "Success",
                data: {
                    token : token,
                    name : user.name,
                    username : user.username,
                    linkKtp: user.linkKTP,
                    saldo : user.saldo,
                    role: user.role,    
                }
            }).status(200);
            return;
        }else{
            res.status(401);
            res.send({
                status: "Error",
                data: "Wrong password"
            });
            return;
        }
    }
}

export async function registerHandler(req: Request<{}, {}, 
    {
        username: string,
        name : string,
        password: string,
        linkKtp : string,
        fotoKtp: string,
}, {}>, res: Response){
    const username : string = req.body.username;
    const name : string = req.body.name;
    const password : string = req.body.password;
    const linkKtp : string = req.body.linkKtp;
    const fotoKtp : string = req.body.fotoKtp;
    const prisma = PrismaInstance.getInstance().getClient();

    console.log("Here");
    console.log(req.body);
    if(typeof username === undefined || typeof name === undefined || typeof password === undefined || typeof linkKtp === undefined || typeof fotoKtp === undefined){
        res.status(400);
        res.send({
            status: "Error",
            data: "Bad request"
        });
        return;
    }

    const existuser : User | null = await prisma.user.findUnique({
        where:{
            username: username
        }
    })

    if(existuser !== null){
        res.status(403);
        res.send({
            status: "Error",
            data : "Username already exist"
        });
        return;
    }

    const hashPassword : string = await generatePassword(password);

    const user = await prisma.user.create({
        data:{
            username: username,
            name: name,
            password: hashPassword,
            linkKTP: linkKtp,
            fotoKTP: fotoKtp,
        }
    })

    if(user === null){
        res.status(500);
        res.send({
            status: "Error",
            data : "internal server error"
        })
        return;
    }

    res.status(200);
    res.send({
        status: "Success",
        data : user
    })  
    return;

}

export async function verifyUserHandler(req: Request<{}, {}, {allUser : string[], role: Role[]}, {}>, res: Response){
    //@ts-ignore
    const role = req.userRole;
    const prisma = PrismaInstance.getInstance().getClient();

    if(role !== Role.ADMIN){
        res.send({
            status: "Error",
            data : "Illegal access"
        }).status(403);
        return
    }

    const alluser : string[] = req.body.allUser;
    const allrole : Role[] = req.body.role;

    if(typeof allrole === undefined || typeof alluser === undefined || allrole.length !== alluser.length){
        res.send({
            status: "Error",
            data: "Bad request"
        }).status(400);
        return;
    }

    var success = true;

    for(let i = 0; i < alluser.length; i ++){
        const user = alluser[i];
        const role = allrole[i];
        
        const newUser = await prisma.user.update({
            where: {
                username : user
            },
            data:{
                role : role,
            }
        })

        if(newUser === null){
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
        data: "Success"
    }).status(200);
}