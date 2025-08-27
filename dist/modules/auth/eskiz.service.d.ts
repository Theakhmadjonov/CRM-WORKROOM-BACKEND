import { ConfigService } from '@nestjs/config';
export declare class EskizService {
    private configService;
    get_token_url: string;
    send_sms_url: string;
    private email;
    private password;
    private token;
    constructor(configService: ConfigService);
    getToken(): Promise<void>;
    sendSms(phone_number: string, otp: string): Promise<void>;
}
