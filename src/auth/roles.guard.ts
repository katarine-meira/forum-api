import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // rota não exige roles

    const { user } = context.switchToHttp().getRequest();

    if (!user) return false;

    // Verifica se a role do usuário está na lista
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Acesso não permitido.');
    }

    return true;
  }
}
