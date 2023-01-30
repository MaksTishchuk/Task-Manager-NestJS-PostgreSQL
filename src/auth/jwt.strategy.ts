import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from 'passport-jwt'
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtPayloadInterface} from "./dto/jwt-payload.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<UserEntity> {
    const {username} = payload
    const user = await this.userRepository.findOne({where: {username}})
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
