import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {AppService} from './app.service';
import {AppController} from './app.controller'
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
  ConfigModule.forRoot({
      isGlobal: true, // يجعل ConfigService متاح في كل المشروع
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
