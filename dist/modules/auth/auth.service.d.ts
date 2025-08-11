import { SendOtpDto } from './dto/send-otp.dto';
import { OtpService } from './otp.service';
export declare class AuthService {
    private otpService;
    constructor(otpService: OtpService);
    sendOtp(body: SendOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(phone_number: string, code: string): Promise<{
        message: string;
    }>;
    register(): Promise<void>;
    login(): Promise<void>;
    logout(): Promise<void>;
}
