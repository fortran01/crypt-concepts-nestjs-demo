import { Module } from '@nestjs/common';
import { CryptoModule } from './crypto/crypto.module';
import { AppController } from './app.controller';

@Module({
  imports: [CryptoModule],
  controllers: [AppController],
})
export class AppModule {}
