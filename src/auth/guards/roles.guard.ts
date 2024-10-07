
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from '../../common/enums/roles.decorator';
  import { Role } from 'src/common/enums/role.enum';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      console.log('RolesGuard: requiredRoles', requiredRoles);
  
      // If no roles are specified, allow access
      if (!requiredRoles) {
        console.log('RolesGuard: No roles required, allowing access');
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      console.log('RolesGuard: user', user);
  
      if (!user) {
        console.log('RolesGuard: No user found in request');
        throw new ForbiddenException('You do not have permission to access this resource');
      }
  
      const hasRole = requiredRoles.includes(user.role);
      console.log(`RolesGuard: User role (${user.role}) has required role: ${hasRole}`);
  
      if (!hasRole) {
        throw new ForbiddenException('You do not have the correct role to access this resource');
      }
  
      return hasRole;
    }
  }