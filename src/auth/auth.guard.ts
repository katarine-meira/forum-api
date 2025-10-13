import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private readonly jwtService: JwtService;

  // Este Guardião é a espinha dorsal da segurança da aplicação garantindo 
  // que o userId só esteja disponível se um token JWT válido estiver presente.
  // guardião do Nest, decide se a requisição deve prosseguir ou não
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = this.extractTokenFromHeader(request);
    if (!authorization) throw new UnauthorizedException('Token is required');

    try{
      const payload = await this.jwtService.verify(authorization, { // decodifica o token e retorna o payload (o conteúdo).
          secret: process.env.SECRET_KEY,
      });
      request['sub'] = payload; // anexa o payload do token diretamente no objeto (permite que qualquer vontrolador ou serviço na cadeia saiba quem é o user logado)
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
    return true; //se tudo der certo o return é true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      request.headers['authorization']?.split(' ') ?? []; //o split pega o bearer e o token
    return type === 'Bearer' ? token : undefined; //aqui ele obriga o bearer e retorna po token, se não retorna undefined
  }
}
