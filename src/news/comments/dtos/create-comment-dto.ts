//import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateCommentDto {
  _id?: mongoose.Types.ObjectId;

  //@IsNotEmpty()
  //@IsString()
  message: string;

  //@IsNotEmpty()
  userId: mongoose.Types.ObjectId;
}
