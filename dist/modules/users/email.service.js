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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmaileService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_resend_1 = require("nestjs-resend");
const config_1 = require("@nestjs/config");
const redis_service_1 = require("../../core/database/redis.service");
let EmaileService = class EmaileService {
    redis;
    resend;
    config;
    MAX_DURATION_LINK = 86400;
    MAX_EMAIL_RATE = 30;
    MAX_HOURLY_LIMIT = 10;
    constructor(redis, resend, config) {
        this.redis = redis;
        this.resend = resend;
        this.config = config;
    }
    getSessionToken() {
        const token = crypto.randomUUID();
        return token;
    }
    async sendLinkEmail(email) {
        const token = this.getSessionToken();
        const fromEmail = this.config.get("HOST_EMAIL");
        await this.setEmailToken(token, email);
        const url = `http://localhost:5173/reset-password?token=${token}`;
        try {
            await this.resend.send({
                from: fromEmail,
                to: email,
                subject: "Email_verification_link",
                html: `<a href=${url}>VerificationLink</a>`,
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async sendCodeEmail(email, otp) {
        const fromEmail = this.config.get("HOST_EMAIL");
        try {
            await this.resend.send({
                from: fromEmail,
                to: email,
                subject: "Email_verification_code",
                html: `<h1>${otp}</h1>`,
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async setEmailToken(token, email) {
        const key = `email-verify:${token}`;
        await this.redis.redis.setex(key, this.MAX_DURATION_LINK, JSON.stringify({
            email,
            createdAt: new Date(),
        }));
    }
    async getEmailToken(token) {
        const key = `email-verify:${token}`;
        return await this.redis.getKeyValue(key);
    }
};
exports.EmaileService = EmaileService;
exports.EmaileService = EmaileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        nestjs_resend_1.ResendService,
        config_1.ConfigService])
], EmaileService);
//# sourceMappingURL=email.service.js.map