import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from 'src/database/entities/tenant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant) private tenantRepsitory: Repository<Tenant>,
  ) {}

  public async getTenantById(id) {
    return await this.tenantRepsitory.findOne({
      where: { id },
    });
  }
}
