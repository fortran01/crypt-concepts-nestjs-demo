import { Controller, Post, Body } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { HashPasswordDto } from './dto/hash-password.dto';
import { EncryptDataDto } from './dto/encrypt-data.dto';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('hash')
  async hashPassword(@Body() hashPasswordDto: HashPasswordDto) {
    return this.cryptoService.hashPassword(
      hashPasswordDto.password,
      hashPasswordDto.algorithm,
      hashPasswordDto.workFactor
    );
  }

  @Post('encrypt')
  async encryptData(@Body() encryptDataDto: EncryptDataDto) {
    return this.cryptoService.encryptData(encryptDataDto.data);
  }

  @Post('decrypt')
  async decryptData(@Body() { data }: { data: string }) {
    return this.cryptoService.decryptData(data);
  }
}
