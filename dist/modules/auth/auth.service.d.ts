import { SendOtpDto } from "./dto/send-otp.dto";
import { OtpService } from "./otp.service";
import { LoginAuthDto } from "./dto/create-auth.dto";
import { PrismaService } from "src/core/database/prisma.service";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private otpService;
    private db;
    private jwt;
    constructor(otpService: OtpService, db: PrismaService, jwt: JwtService);
    sendOtp(body: SendOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(phone_number: string, code: string): Promise<{
        message: string;
    }>;
    register(): Promise<void>;
    login(loginAuthDto: LoginAuthDto): Promise<string>;
    me(userId: string): Promise<{
        email: string | null;
        id: string;
        username: string;
    }>;
    logout(): Promise<void>;
}
