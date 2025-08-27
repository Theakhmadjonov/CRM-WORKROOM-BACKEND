import { SendOtpDto } from "./dto/send-otp.dto";
import { OtpService } from "./otp.service";
import { LoginAuthDto } from "./dto/create-auth.dto";
import { PrismaService } from "src/core/database/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dto/second-step.dto";
import { S3Service } from "src/core/storage/s3/s3Service";
import { updateUserDataDto } from "./dto/updateUserData.dto";
export declare class AuthService {
    private otpService;
    private db;
    private jwt;
    private s3;
    constructor(otpService: OtpService, db: PrismaService, jwt: JwtService, s3: S3Service);
    sendOtp(body: SendOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(phone_number: string, code: string): Promise<{
        message: string;
        sessionToken: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    register(data: SignUpDto, sessionToken: string): Promise<string>;
    login(loginAuthDto: LoginAuthDto): Promise<string>;
    me(userId: string): Promise<{
        email: string | null;
        password: string;
        id: string;
        position: string | null;
        company: string | null;
        location: string | null;
        birth_date: Date | null;
        phone_number: string | null;
        skype: string | null;
        username: string;
        fileName: string | null;
        level: string | null;
    } | {
        img_url: string;
        email: string | null;
        password: string;
        id: string;
        position: string | null;
        company: string | null;
        location: string | null;
        birth_date: Date | null;
        phone_number: string | null;
        skype: string | null;
        username: string;
        fileName: string | null;
        level: string | null;
    }>;
    getWorkload(userId: string): Promise<{
        updatedMembers: any[];
        members?: undefined;
    } | {
        members: ({
            user: {
                email: string | null;
                password: string;
                id: string;
                position: string | null;
                company: string | null;
                location: string | null;
                birth_date: Date | null;
                phone_number: string | null;
                skype: string | null;
                username: string;
                fileName: string | null;
                level: string | null;
            } | null;
        } & {
            email: string;
            id: string;
            memberedId: string | null;
            user_id: string | null;
        })[];
        updatedMembers?: undefined;
    }>;
    updateUserData(data: updateUserDataDto, userId: string): Promise<{
        email: string | null;
        password: string;
        id: string;
        position: string | null;
        company: string | null;
        location: string | null;
        birth_date: Date | null;
        phone_number: string | null;
        skype: string | null;
        username: string;
        fileName: string | null;
        level: string | null;
    }>;
}
