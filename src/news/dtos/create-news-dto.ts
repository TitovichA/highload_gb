import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateNewsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  userId: mongoose.Types.ObjectId;

  cover: string;
}
