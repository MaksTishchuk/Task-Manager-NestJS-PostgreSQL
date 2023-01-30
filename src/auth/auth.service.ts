import {
  ConflictException,
  Injectable,
  InternalServerErrorException, Logger,
  UnauthorizedException
} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import * as bcryptjs from 'bcryptjs'
import {UserEntity} from "../entities/user.entity";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {JwtService} from "@nestjs/jwt";
import {JwtPayloadInterface} from "./dto/jwt-payload.interface";

@Injectable()
export class AuthService {

  private logger = new Logger('AuthService')

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    private jwtService: JwtService
  ) {}


  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    let {username, password} = authCredentialsDto
    password = await bcryptjs.hash(password, 10)
    const user = this.userRepository.create({username, password})
    try {
      await user.save()
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username already exists!')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto) :  Promise<{accessToken: string}> {
    let {username, password} = authCredentialsDto
    const user = await this.userRepository.findOne({where: {username}})
    if (!user || !(await bcryptjs.compare(password, user.password))) {
      throw new UnauthorizedException('User with this credentials was not found!')
    }
    const payload: JwtPayloadInterface = {username}
    const accessToken = await this.jwtService.sign(payload)
    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`)
    return {accessToken}
  }

}
