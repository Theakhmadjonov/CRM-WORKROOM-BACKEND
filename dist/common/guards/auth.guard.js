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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../core/database/prisma.service");
let AuthGuard = class AuthGuard {
    jwtService;
    reflector;
    db;
    constructor(jwtService, reflector, db) {
        this.jwtService = jwtService;
        this.reflector = reflector;
        this.db = db;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies.token;
        const handler = context.getHandler();
        const handlerClass = context.getClass();
        const isFreeAuthClass = this.reflector.get("isFreeAuth", handlerClass);
        const isFreeAuth = this.reflector.get("isFreeAuth", handler);
        if (isFreeAuth || isFreeAuthClass)
            return true;
        try {
            let { userId } = await this.jwtService.verifyAsync(token);
            const user = await this.db.prisma.user.findFirst({
                where: { id: userId },
            });
            if (!user)
                throw new common_1.NotFoundException("User not found");
            request.userId = userId;
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Token invalid");
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        core_1.Reflector,
        prisma_service_1.PrismaService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map