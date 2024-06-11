import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

constructor(
  private readonly reflector:Reflector
){

}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRules:string[]=this.reflector.get(META_ROLES,context.getHandler());

    if (!validRules || validRules.length===0)
      return true;

    const req=context.switchToHttp().getRequest();
    const user=req.user;

    if (!user)
      throw new BadRequestException('usuario no encontrado')

    for (const role of user.roles) {
     if (validRules.includes(role)){
      return true;
     }
    }

    throw new ForbiddenException("rol invalido");
  }
}
