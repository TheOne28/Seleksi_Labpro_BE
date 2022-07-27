
import express from 'express';
import cors from 'cors'

export class ExpressInstance{
    private static expressInstance : ExpressInstance;
    
    private _app: express.Application;

    private constructor(){
        this._app = express();

        this._app.use(cors());

        this._app.use(express.json());
    }

    public static getInstance(): ExpressInstance{
        if( !ExpressInstance.expressInstance){
            ExpressInstance.expressInstance = new ExpressInstance()
        }

        return ExpressInstance.expressInstance;
    }

    public getApp(): express.Application{
        return this._app;
    }


}   