import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ResendService } from "nestjs-resend";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "src/core/database/redis.service";

@Injectable()
export class EmaileService {
  private MAX_DURATION_LINK: number = 86400;
  private MAX_EMAIL_RATE: number = 30;
  private MAX_HOURLY_LIMIT: number = 10;

  constructor(
    private redis: RedisService,
    private resend: ResendService,
    private config: ConfigService
  ) {}

  getSessionToken() {
    const token = crypto.randomUUID();
    return token;
  }

  async sendLinkEmail(email: string) {
    const token = this.getSessionToken();
    const fromEmail = this.config.get("HOST_EMAIL") as string;
    await this.setEmailToken(token, email);
    const url = `http://localhost:5173/reset-password?token=${token}`;
    try {
      await this.resend.send({
        from: fromEmail,
        to: email,
        subject: "Email_verification_link",
        html: `<a href=${url}>VerificationLink</a>`,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async sendCodeEmail(email: string, otp: string) {
    const fromEmail = this.config.get("HOST_EMAIL") as string;
    try {
      await this.resend.send({
        from: fromEmail,
        to: email,
        subject: "Email_verification_code",
        html: `<h1>${otp}</h1>`,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async setEmailToken(token: string, email: string) {
    const key = `email-verify:${token}`;
    await this.redis.redis.setex(
      key,
      this.MAX_DURATION_LINK,
      JSON.stringify({
        email,
        createdAt: new Date(),
      })
    );
  }

  async getEmailToken(token: string) {
    const key = `email-verify:${token}`;
    return await this.redis.getKeyValue(key);
  }
}
