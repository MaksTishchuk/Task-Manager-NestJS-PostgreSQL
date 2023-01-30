import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserEntity} from "../entities/user.entity";
import {PassportModule} from "@nestjs/passport";
import {ConfigModule} from "@nestjs/config";
import {JwtStrategy} from "./jwt.strategy";


@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d'
      }
    }),
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
