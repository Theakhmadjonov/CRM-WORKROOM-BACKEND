import { ResendService } from "nestjs-resend";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "src/core/database/redis.service";
export declare class EmaileService {
    private redis;
    private resend;
    private config;
    private MAX_DURATION_LINK;
    private MAX_EMAIL_RATE;
    private MAX_HOURLY_LIMIT;
    constructor(redis: RedisService, resend: ResendService, config: ConfigService);
    getSessionToken(): `${string}-${string}-${string}-${string}-${string}`;
    sendLinkEmail(email: string): Promise<void>;
    sendCodeEmail(email: string, otp: string): Promise<void>;
    setEmailToken(token: string, email: string): Promise<void>;
    getEmailToken(token: string): Promise<string | null>;
}
