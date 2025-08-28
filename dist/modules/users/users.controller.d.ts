import { UsersService } from "./users.service";
import { Request } from "express";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    update(req: Request, file: Express.Multer.File): Promise<{
        url: string;
    }>;
    chechkEmail(data: {
        email: string;
    }): Promise<boolean>;
    sendEmailVerificationLink(data: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    verifyEmailLink(data: {
        newPassword: string;
        token: string;
    }): Promise<{
        message: string;
    }>;
}
