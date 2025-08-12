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
var SeederService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const config_1 = require("@nestjs/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
let SeederService = SeederService_1 = class SeederService {
    db;
    configService;
    username;
    password;
    email;
    logger = new common_1.Logger(SeederService_1.name);
    constructor(db, configService) {
        this.db = db;
        this.configService = configService;
        this.username = this.configService.get("SUPER_ADMIN_USERNAME");
        this.password = this.configService.get("SUPER_ADMIN_PASSWORD");
        this.email = this.configService.get("SUPER_ADMIN_EMAIL");
    }
    onModuleInit() {
        this.initSeeder();
    }
    async initSeeder() {
        try {
            await this.checkExistingAdmin();
            await this.createAdmin();
            this.logger.log("admin created");
        }
        catch (error) {
            this.logger.warn(error.message);
        }
    }
    async checkExistingAdmin() {
        const findAdmin = await this.db.prisma.user.findFirst({
            where: {
                username: this.username,
            },
        });
        if (!findAdmin)
            return true;
        throw new Error("admin existed!!");
    }
    async createAdmin() {
        const hashedPassword = await bcrypt_1.default.hash(this.password, 12);
        await this.db.prisma.user.create({
            data: {
                username: this.username,
                password: hashedPassword,
                email: this.email,
            },
        });
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = SeederService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], SeederService);
//# sourceMappingURL=seeder.service.js.map