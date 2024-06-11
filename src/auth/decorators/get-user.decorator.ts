import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common"

export const GetUser = createParamDecorator(
    (data,ctx:ExecutionContext)=>{
        const req=ctx.switchToHttp().getRequest();
        const user=req.user;
        if (!user)
            throw new InternalServerErrorException('usuario no encontrado')
        if (!data) {
            return user;  
        }else{
            if (!user[data])
            throw new InternalServerErrorException('usuario no encontrado')
         return user[data]
                
        }
        
    }
);