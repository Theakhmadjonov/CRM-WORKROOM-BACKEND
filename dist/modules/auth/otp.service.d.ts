import { RedisService } from 'src/core/database/redis.service';
import { EskizService } from './eskiz.service';
export declare class OtpService {
    private redisService;
    private eskizService;
    private ttlExpireOtp;
    private hourlyTTLExpireOtp;
    private hourlyOtpAttempts;
    private maxFailedOtpAttempt;
    constructor(redisService: RedisService, eskizService: EskizService);
    getSessionToken(): `${string}-${string}-${string}-${string}-${string}`;
    canSmsRequest(phone_number: string): Promise<void>;
    sendSms(phone_number: string): Promise<{
        message: string;
    }>;
    checkSmsLimit(key: string): Promise<void>;
    trackSmsRequest(key: string): Promise<void>;
    recordFailedAttempts(phone_number: string): Promise<void>;
    verifyOtpCode(phone_number: string, code: string): Promise<`${string}-${string}-${string}-${string}-${string}`>;
    isBlockedUser(phone_number: string): Promise<void>;
}
