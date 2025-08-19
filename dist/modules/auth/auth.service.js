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
const s3Service_1 = require("../../core/storage/s3/s3Service");
let AuthService = class AuthService {
    otpService;
    db;
    jwt;
    s3;
    constructor(otpService, db, jwt, s3) {
        this.otpService = otpService;
        this.db = db;
        this.jwt = jwt;
        this.s3 = s3;
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
            sessionToken,
        };
    }
    async register(data, sessionToken) {
        const findUser = await this.db.prisma.user.findUnique({
            where: { email: data.email },
        });
        const findByPhoneUser = await this.db.prisma.user.findUnique({
            where: { phone_number: data.phone },
        });
        if (findUser || findByPhoneUser)
            throw new common_1.ConflictException("Email or phone_number already exists");
        const key = `session:${data.phone}`;
        await this.otpService.checkTokenUser(key, sessionToken);
        const hashedPassword = await bcrypt_1.default.hash(data.password, 12);
        const user = await this.db.prisma.user.create({
            data: {
                username: data.email,
                email: data.email,
                phone_number: data.phone,
                password: hashedPassword,
            },
        });
        const allAnswers = [
            ...(data.secondStepData || []),
            ...(data.thirdStepData || []),
        ];
        for (const ans of allAnswers) {
            const userAnswer = await this.db.prisma.userProfileQuestionAnswers.create({
                data: {
                    question_id: ans.question_id,
                    user_id: user.id,
                    answer_text: ans.answer_text ?? null,
                },
            });
            if (ans.option_id) {
                await this.db.prisma.selectedAnswerOptions.create({
                    data: {
                        answer_id: userAnswer.id,
                        option_id: ans.option_id,
                    },
                });
            }
        }
        if (data.fourthStepData?.emails?.length) {
            for (const email of data.fourthStepData.emails) {
                const existUser = await this.db.prisma.user.findUnique({
                    where: { email },
                });
                await this.db.prisma.userMember.create({
                    data: {
                        email,
                        user_id: existUser ? existUser.id : null,
                        memberedId: user.id,
                    },
                });
            }
        }
        await this.otpService.delTokenUser(key);
        const token = await this.jwt.signAsync({ userId: user.id });
        return token;
    }
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
        });
        if (!findUser)
            throw new common_1.NotFoundException("User not found");
        if (findUser.fileName) {
            const img_url = await this.s3.getFileUrl(findUser.fileName);
            return {
                ...findUser,
                img_url,
            };
        }
        return findUser;
    }
    async getWorkload(userId) {
        const findUser = await this.db.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!findUser)
            throw new common_1.NotFoundException("User not found");
        const members = await this.db.prisma.userMember.findMany({
            where: {
                memberedId: userId,
            },
            take: 4,
            include: {
                user: true,
            },
        });
        if (members && members.length > 0) {
            const updatedMembers = [];
            for (const member of members) {
                const fileName = member.user?.fileName;
                if (fileName) {
                    const img_url = await this.s3.getFileUrl(fileName);
                    updatedMembers.push({ ...member, img_url });
                }
                else {
                    updatedMembers.push(member);
                }
            }
            return { updatedMembers };
        }
        return { members };
    }
    async updateUserData(data, userId) {
        const user = await this.db.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const newUserData = await this.db.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...data,
            },
        });
        return newUserData;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [otp_service_1.OtpService,
        prisma_service_1.PrismaService,
        jwt_1.JwtService,
        s3Service_1.S3Service])
], AuthService);
//# sourceMappingURL=auth.service.js.map