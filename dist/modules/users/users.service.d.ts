import { PrismaService } from "src/core/database/prisma.service";
import { S3Service } from "src/core/storage/s3/s3Service";
import { EmaileService } from "./email.service";
export declare class UsersService {
    private db;
    private s3;
    private email;
    constructor(db: PrismaService, s3: S3Service, email: EmaileService);
    update(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    checkEmail(email: string): Promise<boolean>;
    sendEmailVerificationLink(email: string): Promise<{
        message: string;
    }>;
    verifyUserEmail(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
