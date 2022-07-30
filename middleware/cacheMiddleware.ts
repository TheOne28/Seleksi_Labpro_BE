import { Request, Response, NextFunction } from 'express';
import mcache from 'memory-cache';

function getCache(duration: number, req: Request, res: Response, next: NextFunction){
    const key = '__express__' + req.originalUrl || req.url

    const cached = mcache.get(key);

    if(cached){
    

    }else{
        
    }
}