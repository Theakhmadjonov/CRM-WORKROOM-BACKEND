import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService implements OnModuleInit {
    prisma: PrismaClient;
    private logger;
    constructor();
    onModuleInit(): Promise<void>;
}
