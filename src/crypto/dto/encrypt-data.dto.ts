import { IsString } from 'class-validator';

export class EncryptDataDto {
  @IsString()
  data: string;
}
