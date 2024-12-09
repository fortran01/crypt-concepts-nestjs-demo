import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  serveIndex(@Res() res: Response) {
    res.sendFile(join(__dirname, 'public', 'index.html'));
  }
}
