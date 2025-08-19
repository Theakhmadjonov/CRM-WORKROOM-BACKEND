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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const send_otp_dto_1 = require("./dto/send-otp.dto");
const verify_sms_code_dto_1 = require("./dto/verify.sms.code.dto");
const create_auth_dto_1 = require("./dto/create-auth.dto");
const second_step_dto_1 = require("./dto/second-step.dto");
const auth_guard_1 = require("../../common/guards/auth.guard");
const updateUserData_dto_1 = require("./dto/updateUserData.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async sendOtp(body) {
        try {
            console.log(111);
            return await this.authService.sendOtp(body);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async verifyOtp(body, res) {
        const { phone_number, code } = body;
        try {
            const data = await this.authService.verifyOtp(phone_number, code);
            res.cookie("sessionToken", data.sessionToken, {
                httpOnly: true,
                path: "/",
                maxAge: 3660,
                secure: false,
                sameSite: "lax",
            });
            return { message: data.message };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async register(data, res, req) {
        try {
            const sessionToken = req.cookies["sessionToken"];
            const token = await this.authService.register(data, sessionToken);
            res.cookie("token", token, {
                httpOnly: true,
                path: "/",
                maxAge: 3600 * 2,
                secure: false,
                sameSite: "lax",
            });
            return { token };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async login(loginAuthDto, res) {
        const token = await this.authService.login(loginAuthDto);
        res.cookie("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "lax",
        });
        return { token };
    }
    async me(req) {
        try {
            const userId = req["userId"];
            const user = await this.authService.me(userId);
            return { user };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async getWorkload(req) {
        const userId = req["userId"];
        console.log("jnxnjsxmk");
        const workloads = await this.authService.getWorkload(userId);
        return workloads;
    }
    async check(req) {
        console.log("ssxsxsxwqxsax");
        const token = req.cookies["token"];
        console.log(token);
        if (!token)
            return false;
        return true;
    }
    async logout(res) {
        res.clearCookie("token");
        return {
            message: "Successfully logged out",
        };
    }
    async updateUserData(res, req, data) {
        try {
            console.log("updatega keldi");
            const userId = req["userId"];
            console.log(userId, "userId");
            const newData = await this.authService.updateUserData(data, userId);
            return newData;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("send-otp"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_otp_dto_1.SendOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)("verify-otp"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_sms_code_dto_1.VerifySmsCodeDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)("register"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [second_step_dto_1.SignUpDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_auth_dto_1.LoginAuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)("workload"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getWorkload", null);
__decorate([
    (0, common_1.Get)("check"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "check", null);
__decorate([
    (0, common_1.Post)("logout"),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)("update"),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, updateUserData_dto_1.updateUserDataDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateUserData", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map