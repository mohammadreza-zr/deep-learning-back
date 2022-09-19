import { PromoteAuthDto } from './dto/promote-auth.dto';
import { ConfigService } from '@nestjs/config';
import { LoginAuthDto } from './dto/login-auth.dto';
import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto, Rule } from './dto';
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
    // check for user exist
    const user = await this.findUserWithEmail(createAuthDto.email);
    if (user) {
      throw new ForbiddenException('user found!');
    } else {
      try {
        //create hash for password
        const hash = await argon.hash(createAuthDto.password);

        //save on database
        const newUser = new this.authModel({
          fullName: createAuthDto.fullName,
          email: createAuthDto.email,
          password: hash,
        });
        const result: AuthInterface = await newUser.save();

        const token = await this.jwt.sign(
          { userId: result.id },
          {
            expiresIn: '1H',
            secret: this.config.get('JWT_SECRET'),
          },
        );

        const mailError = await sendEmail(
          result.email,
          result.fullName,
          'signUp',
          token,
        );

        if (mailError)
          return {
            statusCode: 500,
            message: 'error when sending email! but account has been created!',
            error: 'mail error',
          };

        // return jwt token and user data
        const { access_token } = await this.signToken(result.id, result.email);

        return {
          id: result.id,
          fullName: result.fullName,
          createdAt: result.createdAt,
          rule: result.rule,
          token: access_token,
        };
      } catch (err) {
        throw new HttpException('Error on Server!', 500);
      }
    }
  }

  async login(login: LoginAuthDto) {
    //check for user exist
    const user = await this.findUserWithEmail(login.email);
    if (!user) throw new ForbiddenException('credentials incorrect!');

    //verify password
    const password = await argon.verify(user.password, login.password);
    if (!password) throw new ForbiddenException('credentials incorrect!');

    const { access_token } = await this.signToken(user.id, user.email);

    //return jwt token
    return {
      id: user.id,
      fullName: user.fullName,
      createdAt: user.createdAt,
      rule: user.rule,
      token: access_token,
    };
  }

  async verifyEmail(token: string) {
    let user = null;
    //verify token
    try {
      user = await this.jwt.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });
    } catch (err) {
      return 'access denied!';
    }
    if (!user) return 'access denied!';

    //check from database
    const result = await this.authModel.findById(user.userId);

    //user is valid?
    if (result.id !== user.userId) return 'access denied!';

    //update database
    result.emailVerified = true;
    await result.save();

    return 'tank you for verify.';
  }

  async promoteAdmin(id: string, promote: PromoteAuthDto) {
    //find admin and check rule
    const admin = await this.authModel.findById(id);
    if (!admin) throw new ForbiddenException('credentials incorrect!');
    if (admin.rule !== Rule.SUPER_ADMIN)
      throw new ForbiddenException('permission denied!');

    //find user and promote rule
    const user = await this.findUserWithEmail(promote.email);
    if (!user) throw new NotFoundException('user not Found!');

    user.rule = Rule.ADMIN;
    await user.save();

    //return ok
    return {
      statusCode: 200,
      message: 'success',
    };
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
      expiresIn: this.config.get('expireToken'),
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      access_token: token,
    };
  }
}
