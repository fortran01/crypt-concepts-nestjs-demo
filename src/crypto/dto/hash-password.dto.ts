import { IsString, IsIn, IsInt, Min, Max, IsOptional, ValidateIf } from 'class-validator';

export class HashPasswordDto {
  @IsString()
  password: string;

  @IsString()
  @IsIn(['sha256', 'sha3', 'bcrypt', 'argon2'])
  algorithm: string;

  @ValidateIf(o => o.algorithm === 'bcrypt' || o.algorithm === 'argon2')
  @IsInt()
  @Min(4)
  @Max(16)
  workFactor?: number = 12;
}
