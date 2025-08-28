import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { SendOtpDto } from "./dto/send-otp.dto";
import { OtpService } from "./otp.service";
import { LoginAuthDto, RegisterAuthDto } from "./dto/create-auth.dto";
import bcrypt from "bcrypt";
import { PrismaService } from "src/core/database/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dto/second-step.dto";
import { S3Service } from "src/core/storage/s3/s3Service";
import { updateUserDataDto } from "./dto/updateUserData.dto";
import { UsersService } from "../users/users.service";
// import { v4 as uuid } from 'uuid';
import { v4 as uuid } from "uuid";

@Injectable()
export class AuthService {
  constructor(
    private otpService: OtpService,
    private db: PrismaService,
    private jwt: JwtService,
    private s3: S3Service,
    private users: UsersService
  ) {}
  async sendOtp(body: SendOtpDto) {
    const { phone_number } = body;
    const data = await this.otpService.sendSms(phone_number);
    return data;
  }
  async verifyOtp(phone_number: string, code: string) {
    await this.otpService.isBlockedUser(phone_number);
    const sessionToken = await this.otpService.verifyOtpCode(
      phone_number,
      code
    );
    return {
      message: "success",
      sessionToken,
    };
  }

  async register(data: RegisterAuthDto, sessionToken: string) {
    const findUser = await this.db.prisma.user.findUnique({
      where: { email: data.email },
    });
    const findByPhoneUser = await this.db.prisma.user.findUnique({
      where: { phone_number: data.phone_number },
    });
    if (findUser || findByPhoneUser)
      throw new ConflictException("Email or phone_number already exists");
    const key = `session:${data.phone_number}`;
    await this.otpService.checkTokenUser(key, sessionToken);
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const newUser = await this.db.prisma.user.create({
      data: {
        username: data.email,
        email: data.email,
        phone_number: data.phone_number,
        password: hashedPassword,
      },
    });
    data.answers.map(async (answer) => {
      const newAnswer = await this.db.prisma.userProfileQuestionAnswers.create({
        data: {
          question_id: answer.question_id,
          answer_text: typeof answer.value === "string" ? answer.value : null,
          user_id: newUser.id,
        },
      });
      if (Array.isArray(answer.value)) {
        answer.value.map(async (value) => {
          return await this.db.prisma.selectedAnswerOptions.create({
            data: {
              option_id: value as string,
              answer_id: newAnswer.id,
            },
          });
        });
      }
    });
    data.members.map(async (member) => {
      const existUser = await this.db.prisma.user.findFirst({
        where: {
          email: member,
        },
      });
      if (existUser) {
        const expireAt = new Date();
        expireAt.setHours(2);
        const iToken = await this.createToken();
        await this.db.prisma.memberInvitations.create({
          data: {
            email: member,
            expires_at: expireAt,
            invitation_token: iToken,
            invited_by_user_id: newUser.id,
          },
        });
      }
    });
    await this.otpService.delTokenUser(key);
    const token = await this.jwt.signAsync({ userId: newUser.id });
    return token;
  }

  async login(loginAuthDto: LoginAuthDto) {
    const findEmail = await this.db.prisma.user.findUnique({
      where: {
        email: loginAuthDto.email,
      },
    });

    if (!findEmail) throw new NotFoundException("Email or password incorrect");

    const comparePassword = await bcrypt.compare(
      loginAuthDto.password,
      findEmail.password
    );

    if (!comparePassword)
      throw new NotFoundException("Email or password incorrect");

    const token = await this.jwt.signAsync({ userId: findEmail.id });

    return token;
  }

  async me(userId: string) {
    const findUser = await this.db.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        birth_date: true,
        company: true,
        fileName: true,
        first_name: true,
        last_name: true,
        level: true,
        location: true,
        phone_number: true,
        position: true,  
      },
    });
    if (!findUser) throw new NotFoundException("User not found");
    if (findUser.fileName) {
      const img_url = await this.s3.getFileUrl(findUser.fileName);
      return {
        ...findUser,
        img_url,
      };
    }
    return findUser;
  }

  async getWorkload(userId: string) {
    const findUser = await this.db.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!findUser) throw new NotFoundException("User not found");
    const members = await this.db.prisma.memberInvitations.findMany({
      where: {
        invited_by_user_id: userId,
      },
      take: 4,
      include: {
        Users: true,
      },
    });
    if (members && members.length > 0) {
      const updatedMembers: Array<any> = [];
      for (const member of members) {
        const fileName = member.Users?.fileName;
        if (fileName) {
          const img_url = await this.s3.getFileUrl(fileName);
          updatedMembers.push({ ...member, img_url });
        } else {
          updatedMembers.push(member);
        }
      }
      return { updatedMembers };
    }
    return { members };
  }

  async updateUserData(data: updateUserDataDto, userId: string) {
    const user = await this.db.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException("User not found");
    const newUserData = await this.db.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
      },
    });
    return newUserData;
  }

  async createToken() {
    return uuid();
  }
}
