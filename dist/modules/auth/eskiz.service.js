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
exports.EskizService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let EskizService = class EskizService {
    configService;
    get_token_url;
    send_sms_url;
    email;
    password;
    token;
    constructor(configService) {
        this.configService = configService;
        this.get_token_url = this.configService.get('ESKIZ_GET_TOKEN_URL');
        this.send_sms_url = this.configService.get('ESKIZ_SEND_SMS_URL');
        this.email = this.configService.get('ESKIZ_EMAIL');
        this.password = this.configService.get('ESKIZ_PASSWORD');
    }
    async getToken() {
        const formData = new FormData();
        formData.set('email', this.email);
        formData.set('password', this.password);
        const { data: { data: { token }, }, } = await axios_1.default.post(this.get_token_url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        this.token = token;
    }
    async sendSms(phone_number, otp) {
        await this.getToken();
        const message = `StudyHub ilovasiga kirish kodi:${otp}`;
        const formData = new FormData();
        formData.set('mobile_phone', phone_number);
        formData.set('message', message);
        formData.set('from', '4546');
        const { status } = await axios_1.default.post(this.send_sms_url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${this.token}`,
            },
        });
        if (status !== 200)
            throw new Error('send sms failed');
    }
};
exports.EskizService = EskizService;
exports.EskizService = EskizService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EskizService);
//# sourceMappingURL=eskiz.service.js.map