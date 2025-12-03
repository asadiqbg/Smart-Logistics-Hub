import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class LocationDto {
  @ApiProperty({ example: '123 Warehouse St, NYC' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: [40.7128, -74.006] })
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: [number, number];

  @ApiProperty({ example: '2025-01-15T09:00:00Z' })
  @IsDateString()
  windowStart: string;

  @ApiProperty({ example: '2025-01-15T11:00:00Z' })
  @IsDateString()
  windowEnd: string;
}

class PackageDto {
  @ApiProperty({ example: 2.5 })
  @IsNumber()
  @Min(0.1)
  weightKg: number;

  @ApiPropertyOptional({ example: { length: 30, width: 20, height: 15 } })
  @IsOptional()
  //we don't create a nestes dto for dimensions because it doesn't represent a domain like packageDto and locationDto does, which are value objects in domain driven design inside out Order aggreate
  dimensions?: { length: number; width: number; height: number };

  @ApiPropertyOptional({ example: 'Fragile - handle with care' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 'SHOP-123' })
  @IsOptional()
  @IsString()
  externalOrderId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  pickup: LocationDto;

  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  //here with validateNested(), we are telling validation pipe to recursively apply the validation rules defined in the nested object DTO's class
  @Type(() => LocationDto)
  delivery: LocationDto;

  @ApiProperty({ type: PackageDto })
  @ValidateNested()
  @Type(() => PackageDto)
  package: PackageDto;
}
