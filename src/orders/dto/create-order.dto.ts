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
