import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { UsersService } from "./users.service";

@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put()
  @UseInterceptors(FileInterceptor("file"))
  async update(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    try {
      console.log("sorov keldi");
      return this.usersService.update(file);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post("email-check")
  @HttpCode(200)
  async chechkEmail(@Body() data: { email: string }) {
    console.log("Emailga sorov keldi");
    return await this.usersService.checkEmail(data.email);
  }

  @Post("forgot-password")
  @HttpCode(200)
  async sendEmailVerificationLink(@Body() data: { email: string }) {
    try {
      return await this.usersService.sendEmailVerificationLink(data.email);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("reset-password")
  async verifyEmailLink(
    @Body() data: { newPassword: string, token: string }
  ) {
    try {
      console.log("pass keldi", data);
      return await this.usersService.verifyUserEmail(data.token, data.newPassword);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
