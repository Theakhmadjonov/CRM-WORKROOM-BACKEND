import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import bcrypt from "bcrypt";
import { PrismaService } from "src/core/database/prisma.service";
import { S3Service } from "src/core/storage/s3/s3Service";
import { EmaileService } from "./email.service";
@Injectable()
export class UsersService {
  constructor(
    private db: PrismaService,
    private s3: S3Service,
    private email: EmaileService
  ) {}
  async update(file: Express.Multer.File) {
    const fileName = await this.s3.uploadFile(file, "images");
    const signedUrl = await this.s3.getFileUrl(fileName);
    return { url: signedUrl };
  }

  async checkEmail(email: string) {
    const emailExists = await this.db.prisma.user.findFirst({
      where: {
        email,
      },
    });
    return emailExists ? true : false;
  }

  async sendEmailVerificationLink(email: string) {
    try {
      const existedEmail = await this.db.prisma.user.findFirst({
        where: { email },
      });
      if (!existedEmail) throw new NotFoundException("Email not found");
      await this.email.sendLinkEmail(email);
      return {
        message: "Link sended",
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async verifyUserEmail(token: string, newPassword: string) {
    try {
      const data = await this.email.getEmailToken(token);
      const res = JSON.parse(data as string);
      const user = await this.db.prisma.user.findFirst({
        where: { email: res.email },
      });
      if (!user) throw new NotFoundException("User not found");
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.db.prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          password: hashedPassword,
        },
      });
      return {
        message: "Your password updated",
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
