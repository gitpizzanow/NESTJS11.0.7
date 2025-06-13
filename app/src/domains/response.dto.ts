import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * Standard response DTO
 * @description Used for consistent API responses
 */
export class ResponseDto {
  @ApiProperty({ description: 'Response message' })
  @IsString()
  message: string;
}
