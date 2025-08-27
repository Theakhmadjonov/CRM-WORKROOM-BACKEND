import { Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
export declare class RedisService implements OnModuleInit {
    private configService;
    redis: Redis;
    logger: Logger;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    addKey(key: string, value: string, expire: number): Promise<void>;
    delKey(key: string): Promise<void>;
    getKeyValue(key: string): Promise<string | null>;
    getTTLKey(key: string): Promise<number>;
    setExpireKey(key: string, expire: number): Promise<void>;
    incrementKey(key: string): Promise<void>;
    setSessionTokenUser(phone: string, token: string): Promise<void>;
}
