import { ConfigService } from '@nestjs/config';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto, UpdateAuthDto } from './dto';
import { AuthInterface } from './interfaces';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { sendEmail } from 'src/utils/mailer';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
    @InjectModel('Auth') private readonly authModel: Model<AuthInterface>,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    //check for user exist
    // const user = await this.findUserWithEmail(createAuthDto.email);
    // if (user) {
    // throw new ForbiddenException('user found!');
    // } else {
    try {
      //create hash for password
      const hash = await argon.hash(createAuthDto.password);

      //save on database
      const newUser = new this.authModel({
        fullName: createAuthDto.fullName,
        email: createAuthDto.email,
        password: hash,
        emailVerifyCode: '111',
      });
      const result: AuthInterface = await newUser.save();

      //send verify email

      await sendEmail(result.email, result.fullName, 'signUp', 'message');

      // return jwt token and user data
      return this.signToken(result.id, result.email);
    } catch (err) {
      throw new HttpException('Error on Server!', 500);
    }
    // }
  }

  async login(login: LoginAuthDto) {
    //check for user exist
    const user = await this.findUserWithEmail(login.email);
    if (!user) throw new ForbiddenException('credentials incorrect!');

    //verify password
    const password = await argon.verify(user.password, login.password);
    if (!password) throw new ForbiddenException('credentials incorrect!');

    //return jwt token
    return {
      id: user.id,
      fullName: user.fullName,
      createdAt: user.createdAt,
      rule: user.rule,
      token: 'this is token',
    };
  }

  async findAll() {
    return `ok:`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    console.log(updateAuthDto);

    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private async findUserWithEmail(email: string) {
    try {
      const user: AuthInterface = await this.authModel
        .findOne({ email })
        .exec();
      return user;
    } catch (err) {
      throw new HttpException('Error on Server!', 500);
    }
  }

  private async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '72H',
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      access_token: token,
    };
  }
}
