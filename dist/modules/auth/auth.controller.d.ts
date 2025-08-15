import { AuthService } from "./auth.service";
import { SendOtpDto } from "./dto/send-otp.dto";
import { VerifySmsCodeDto } from "./dto/verify.sms.code.dto";
import { LoginAuthDto } from "./dto/create-auth.dto";
import { Request, Response } from "express";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    sendOtp(body: SendOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(body: VerifySmsCodeDto): Promise<{
        message: string;
    }>;
    register(): Promise<void>;
    login(loginAuthDto: LoginAuthDto, res: Response): Promise<{
        token: string;
    }>;
    me(req: Request): Promise<{
        user: {
            email: string | null;
            id: string;
            username: string;
        };
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
}
