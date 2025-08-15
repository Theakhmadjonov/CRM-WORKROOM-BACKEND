import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/core/database/prisma.service";
export declare class AuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly reflector;
    private readonly db;
    constructor(jwtService: JwtService, reflector: Reflector, db: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
