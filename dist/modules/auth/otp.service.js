"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../core/database/redis.service");
const eskiz_service_1 = require("./eskiz.service");
const generate_otp_1 = __importDefault(require("../../utils/generate-otp"));
let OtpService = class OtpService {
    redisService;
    eskizService;
    ttlExpireOtp = 60;
    hourlyTTLExpireOtp = 3600;
    hourlyOtpAttempts = 10;
    maxFailedOtpAttempt = 5;
    constructor(redisService, eskizService) {
        this.redisService = redisService;
        this.eskizService = eskizService;
    }
    getSessionToken() {
        const token = crypto.randomUUID();
        return token;
    }
    async canSmsRequest(phone_number) {
        const key = `sms:otp:${phone_number}:code`;
        const keyExists = await this.redisService.redis.exists(key);
        if (keyExists) {
            const ttl = await this.redisService.getTTLKey(key);
            throw new common_1.BadRequestException(`Please try again later ${ttl}`);
        }
    }
    async sendSms(phone_number) {
        await this.isBlockedUser(phone_number);
        await this.canSmsRequest(phone_number);
        await this.checkSmsLimit(phone_number);
        const otpCode = (0, generate_otp_1.default)();
        await this.eskizService.sendSms(phone_number, otpCode);
        const key = `sms:otp:${phone_number}:code`;
        await this.redisService.addKey(key, otpCode, this.ttlExpireOtp);
        await this.trackSmsRequest(phone_number);
        return {
            message: "otp sended",
        };
    }
    async checkSmsLimit(key) {
        const otpKeyHourly = `sms:otp:${key}:limit:hourly`;
        const valueOtpHourly = await this.redisService.getKeyValue(otpKeyHourly);
        if (valueOtpHourly && +valueOtpHourly > this.hourlyOtpAttempts)
            throw new common_1.BadRequestException("otp hourly limit reached");
    }
    async trackSmsRequest(key) {
        const keyOtpHourly = `sms:otp:${key}:limit:hourly`;
        await this.redisService.incrementKey(keyOtpHourly);
        await this.redisService.setExpireKey(keyOtpHourly, this.hourlyTTLExpireOtp);
    }
    async recordFailedAttempts(phone_number) {
        const keyFailedAttempts = `sms:otp:${phone_number}:failed:attempts`;
        const existsKeyFailedAttempts = await this.redisService.redis.exists(keyFailedAttempts);
        await this.redisService.incrementKey(keyFailedAttempts);
        if (!existsKeyFailedAttempts) {
            await this.redisService.setExpireKey(keyFailedAttempts, 300);
        }
        const value = await this.redisService.getKeyValue(keyFailedAttempts);
        if (+value >= this.maxFailedOtpAttempt) {
            const keyBlockedUser = `sms:otp:${phone_number}:blocked`;
            await this.redisService.addKey(keyBlockedUser, JSON.stringify({
                reason: "Max Otp Attempts",
                blockedAt: new Date(),
                unblockAt: new Date().setMinutes(5),
            }), 300);
            await this.redisService.delKey(keyFailedAttempts);
        }
    }
    async verifyOtpCode(phone_number, code) {
        const key = `sms:otp:${phone_number}:code`;
        const value = await this.redisService.getKeyValue(key);
        if (value !== code) {
            await this.recordFailedAttempts(phone_number);
            throw new common_1.BadRequestException({
                message: "wrong otp password",
            });
        }
        await this.redisService.delKey(key);
        await this.redisService.delKey(`sms:otp:${phone_number}:failed:attempts`);
        const sessionToken = this.getSessionToken();
        await this.redisService.setSessionTokenUser(phone_number, sessionToken);
        return sessionToken;
    }
    async checkTokenUser(key, token) {
        const sessionToken = await this.redisService.getKeyValue(key);
        if (!sessionToken || sessionToken !== token)
            throw new common_1.BadRequestException("Session token expired");
        return true;
    }
    async isBlockedUser(phone_number) {
        const keyBlockedUser = `sms:otp:${phone_number}:blocked`;
        const value = await this.redisService.getKeyValue(keyBlockedUser);
        const ttl = await this.redisService.getTTLKey(keyBlockedUser);
        if (value)
            throw new common_1.BadRequestException({
                message: `You blocked! Please try again after ${ttl}`,
            });
    }
    async delTokenUser(key) {
        await this.redisService.delKey(key);
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        eskiz_service_1.EskizService])
], OtpService);
//# sourceMappingURL=otp.service.js.map