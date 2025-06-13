import { Global, Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Global()
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  /**
   * Connect to the database when the module initializes
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('✔️ Connected to the database');
  }

  /**
   * Disconnect from the database when the module is destroyed
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('🛑 Disconnected from the database');
  }
}

