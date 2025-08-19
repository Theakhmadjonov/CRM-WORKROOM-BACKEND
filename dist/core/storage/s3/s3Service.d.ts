import { S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
export declare class S3Service extends S3Client {
    private configS;
    private bucketName;
    constructor(configS: ConfigService);
    uploadFile(file: Express.Multer.File, prefix: string): Promise<string>;
    getFileUrl(key: string): Promise<string>;
}
