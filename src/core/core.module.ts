import { DynamicModule, Global, Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { StorageModule } from "./storage/storage.module";
import { ResendModule } from "nestjs-resend";
@Global()
@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET_KEY"),
        signOptions: {
          expiresIn: "2d",
        },
      }),
      inject: [ConfigService],
    }),
    ResendModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        apiKey: config.get("RESEND_API_KEY") as string,
      }),
    }) as DynamicModule,
  ],
  exports: [],
  providers: [],
})
export class CoreModule {}
