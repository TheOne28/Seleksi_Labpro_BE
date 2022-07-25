import { Prisma, PrismaClient } from "@prisma/client";

export class PrismaInstance{
    private static prismaInstance : PrismaInstance;

    private _client: PrismaClient;

    private constructor(){
        this._client = new PrismaClient();
    }

    public static getInstance(): PrismaInstance{
        if( !PrismaInstance.prismaInstance){
            PrismaInstance.prismaInstance = new PrismaInstance();
        }

        return PrismaInstance.prismaInstance;
    }

    public getClinet(): PrismaClient{
        return this._client;
    }

    public disconnect(){
        this._client.$disconnect();
    }
}