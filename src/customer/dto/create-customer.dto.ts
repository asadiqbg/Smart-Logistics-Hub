import {
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GeoPointDto {
  @IsString()
  type: 'Point';

  @ValidateNested({ each: true })
  @Type(() => Number)
  coordinates: [number, number]; // [longitude, latitude]
}

export class CreateCustomerDto {
  @IsString()
  tenantId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  phone: string;

  //PostGis Point
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoPointDto)
  defaultAddress?: GeoPointDto;
}
