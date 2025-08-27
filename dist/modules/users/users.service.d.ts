import { PrismaService } from "src/core/database/prisma.service";
import { S3Service } from "src/core/storage/s3/s3Service";
export declare class UsersService {
    private db;
    private s3;
    constructor(db: PrismaService, s3: S3Service);
    update(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    checkEmail(email: string): Promise<boolean>;
}
