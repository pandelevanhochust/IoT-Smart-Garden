import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { lastValueFrom } from 'rxjs';
import { PUBLIC_KEY } from 'src/decorator/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector){
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if(isPublic) return true; 
        
        const result = super.canActivate(context);
        if (result instanceof Promise) {
            return result;
        } else if (result instanceof Boolean || typeof result === 'boolean') {
            return result as boolean;
        } else {
            return lastValueFrom(result);
        }
    }
}
