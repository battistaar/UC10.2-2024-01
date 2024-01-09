import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeReuseController } from './code-reuse/code-reuse.controller';

@Module({
  imports: [],
  controllers: [AppController, CodeReuseController],
  providers: [AppService],
})
export class AppModule {}
