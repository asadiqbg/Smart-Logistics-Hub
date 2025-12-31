import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRouteDto {
  @ApiProperty({
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  orderIds: string[];
}
