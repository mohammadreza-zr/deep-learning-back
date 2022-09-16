import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rule, Users } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly usersModel: Model<Users>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const find = await this.usersModel.findOne({ email: createUserDto.email });
    if (find) {
      return 'User has been found!';
    } else {
      const newUser = new this.usersModel({
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        password: createUserDto.password,
        ...createUserDto,
      });
      const result: any = await newUser.save();
      console.log(result);
      return 'user created';
    }
  }

  async login(createUserDto: CreateUserDto) {
    const find = await this.usersModel.findOne({ email: createUserDto.email });
    if (find) {
      return 'User has been found!';
    } else {
      const newUser = new this.usersModel({
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        password: createUserDto.password,
      });
      const result: any = await newUser.save();
      console.log(result);
      return 'user created';
    }
  }

  async verify(createUserDto: CreateUserDto) {
    const find = await this.usersModel.findOne({ email: createUserDto.email });
    if (find) {
      return 'User has been found!';
    } else {
      const newUser = new this.usersModel({
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        password: createUserDto.password,
      });
      const result: any = await newUser.save();
      console.log(result);
      return 'user created';
    }
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUser(email);
    if (user) {
      user.emailVerified = true;
      user.rule = Rule.SUPER_ADMIN;
      user.save();
      return user;
    } else {
      return 'User not Found!';
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async findUser(email: string): Promise<Users> {
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('not found user!');
    }
    return user;
  }
}
