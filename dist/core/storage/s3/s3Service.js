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
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3Service = class S3Service extends client_s3_1.S3Client {
    configS;
    bucketName;
    constructor(configS) {
        const config = {
            region: configS.get("AWS_REGION") || "eu-north-1",
            credentials: {
                accessKeyId: configS.get("AWS_ACCESS_KEY") || "",
                secretAccessKey: configS.get("AWS_SECRET_ACCESS_KEY") || "",
            },
        };
        super(config);
        this.configS = configS;
        this.bucketName = configS.get("AWS_BUCKET") || "";
    }
    async uploadFile(file, prefix) {
        const fileName = `${prefix}/${(0, uuid_1.v4)()}`;
        const cmd = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        const response = await this.send(cmd);
        if (response.$metadata.httpStatusCode === 200) {
            return fileName;
        }
        throw new common_1.HttpException("File upload failed", 500);
    }
    async getFileUrl(key) {
        const cmd = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(this, cmd, { expiresIn: 3600 * 24 });
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3Service.js.map