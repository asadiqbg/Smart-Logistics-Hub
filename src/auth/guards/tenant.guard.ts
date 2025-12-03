import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantService } from 'src/tenant/tenant.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly tenantService: TenantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.tenantId) {
      throw new UnauthorizedException('No tenant context');
    }

    const tenant = await this.tenantService.getTenantById(user.tenantId);

    if (!tenant || tenant.subscriptionStatus !== 'active') {
      throw new UnauthorizedException('Invalid or inactive tenant');
    }

    request.tenantId = user.tenantId;
    return true;
  }
}
