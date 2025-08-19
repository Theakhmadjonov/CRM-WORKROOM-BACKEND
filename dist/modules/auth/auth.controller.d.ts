import { AuthService } from "./auth.service";
import { SendOtpDto } from "./dto/send-otp.dto";
import { VerifySmsCodeDto } from "./dto/verify.sms.code.dto";
import { LoginAuthDto } from "./dto/create-auth.dto";
import { Request, Response } from "express";
import { SignUpDto } from "./dto/second-step.dto";
import { updateUserDataDto } from "./dto/updateUserData.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    sendOtp(body: SendOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(body: VerifySmsCodeDto, res: Response): Promise<{
        message: string;
    }>;
    register(data: SignUpDto, res: Response, req: Request): Promise<{
        token: string;
    }>;
    login(loginAuthDto: LoginAuthDto, res: Response): Promise<{
        token: string;
    }>;
    me(req: Request): Promise<{
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
        };
    }>;
    getWorkload(req: Request): Promise<{
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
    check(req: Request): Promise<boolean>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    updateUserData(res: Response, req: Request, data: updateUserDataDto): Promise<{
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
