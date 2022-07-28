import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

//Expires in 1 hour
export function generateToken(username: string) : string{
    return jwt.sign(username, process.env.TOKEN_SECRET as string, {expiresIn: '3600s'});
}


export function verifyToken(token: string){
    var userVal;

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) =>{
        if(err){
            userVal = null;
        }

        userVal = user;
    })

    return userVal;
}