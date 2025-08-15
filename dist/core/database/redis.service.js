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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisService = RedisService_1 = class RedisService {
    configService;
    redis;
    logger = new common_1.Logger(RedisService_1.name);
    constructor(configService) {
        this.configService = configService;
        this.redis = new ioredis_1.default({
            host: this.configService.get("REDIS_HOST"),
            port: +this.configService.get("REDIS_PORT"),
        });
    }
    async onModuleInit() {
        try {
            this.redis.on("error", (err) => {
                throw new Error(err.message);
            });
            this.redis.on("connect", () => {
                this.logger.log("Redis connected");
            });
        }
        catch (error) {
            this.redis.disconnect();
            this.logger.error("Redis disconnected");
        }
    }
    async addKey(key, value, expire) {
        await this.redis.setex(key, expire, value);
    }
    async delKey(key) {
        await this.redis.del(key);
    }
    async getKeyValue(key) {
        const value = await this.redis.get(key);
        return value;
    }
    async getTTLKey(key) {
        const ttl = await this.redis.ttl(key);
        return ttl;
    }
    async setExpireKey(key, expire) {
        await this.redis.expire(key, expire);
    }
    async incrementKey(key) {
        await this.redis.incr(key);
    }
    async setSessionTokenUser(phone, token) {
        await this.redis.setex(`session:${phone}`, 300, token);
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map