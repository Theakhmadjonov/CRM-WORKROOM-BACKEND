import { Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ConfigService } from "@nestjs/config";
export declare class SeederService implements OnModuleInit {
    private db;
    private configService;
    username: string;
    password: string;
    email: string;
    logger: Logger;
    constructor(db: PrismaService, configService: ConfigService);
    onModuleInit(): void;
    initSeeder(): Promise<void>;
    checkExistingAdmin(): Promise<boolean>;
    createAdmin(): Promise<void>;
}
