import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Role } from '@prisma/client';

dotenv.config();

//Expires in 1 hour
export function generateToken(username: string, role: Role) : string{
    return jwt.sign({username: username, role: role}, process.env.TOKEN_SECRET as string, {expiresIn: "3600s"});
}


export function verifyToken(token: string){
    var val;

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) =>{
        if(err){
            val = null;
        }

        val = {
            username: user.username,
            role : user.role,
        }
    })

    return val;
}