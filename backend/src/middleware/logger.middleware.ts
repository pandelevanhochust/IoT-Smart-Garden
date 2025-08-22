import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction){
        const {method, params, query, url } = req;
        const start = Date.now();

        res.on('finish',() => {              
            const duration = Date.now() - start;
            console.log(`[${method}] - ${url} - ${res.statusCode} - (${duration}ms)`);
        })
        console.log("Hello");
        next();
    }
}
