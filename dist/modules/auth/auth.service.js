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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const otp_service_1 = require("./otp.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_service_1 = require("../../core/database/prisma.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    otpService;
    db;
    jwt;
    constructor(otpService, db, jwt) {
        this.otpService = otpService;
        this.db = db;
        this.jwt = jwt;
    }
    async sendOtp(body) {
        const { phone_number } = body;
        const data = await this.otpService.sendSms(phone_number);
        return data;
    }
    async verifyOtp(phone_number, code) {
        await this.otpService.isBlockedUser(phone_number);
        const sessionToken = await this.otpService.verifyOtpCode(phone_number, code);
        return {
            message: "success",
        };
    }
    async register() { }
    async login(loginAuthDto) {
        const findEmail = await this.db.prisma.user.findUnique({
            where: {
                email: loginAuthDto.email,
            },
        });
        if (!findEmail)
            throw new common_1.NotFoundException("Email or password incorrect");
        const comparePassword = await bcrypt_1.default.compare(loginAuthDto.password, findEmail.password);
        if (!comparePassword)
            throw new common_1.NotFoundException("Email or password incorrect");
        const token = await this.jwt.signAsync({ userId: findEmail.id });
        return token;
    }
    async me(userId) {
        const findUser = await this.db.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                username: true,
            },
        });
        if (!findUser)
            throw new common_1.NotFoundException("Information not found");
        return findUser;
    }
    async logout() { }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [otp_service_1.OtpService,
        prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map