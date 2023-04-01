import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dtos/create-user-dto';
import { hash } from '../utils/crypto';
import { Users, UsersDocument } from './users.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
  ) {}

  async create(user: CreateUserDto): Promise<Users> {
    user.password = await hash(user.password);
    const createdUser = new this.usersModel(user);
    return createdUser.save();
  }

  async findById(id: mongoose.Types.ObjectId): Promise<Users> {
    return this.usersModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<Users> {
    return this.usersModel.findOne({ email }).exec();
  }

  async findAll(): Promise<Users[]> {
    return this.usersModel.find().exec();
  }
}
