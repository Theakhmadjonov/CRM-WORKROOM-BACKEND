import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifySmsCodeDto } from './dto/verify.sms.code.dto';
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
    login(): Promise<void>;
    logout(): Promise<void>;
}
