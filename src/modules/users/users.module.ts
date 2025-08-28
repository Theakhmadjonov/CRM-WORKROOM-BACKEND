import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { EmaileService } from "./email.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, EmaileService],
  exports: [UsersService],
})
export class UsersModule {}
