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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma.service");
const s3Service_1 = require("../../core/storage/s3/s3Service");
let UsersService = class UsersService {
    db;
    s3;
    constructor(db, s3) {
        this.db = db;
        this.s3 = s3;
    }
    async update(file) {
        const fileName = await this.s3.uploadFile(file, "images");
        const signedUrl = await this.s3.getFileUrl(fileName);
        return { url: signedUrl };
    }
    async checkEmail(email) {
        const emailExists = await this.db.prisma.user.findFirst({
            where: {
                email,
            },
        });
        return emailExists ? true : false;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3Service_1.S3Service])
], UsersService);
//# sourceMappingURL=users.service.js.map