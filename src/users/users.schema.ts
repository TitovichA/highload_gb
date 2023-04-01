import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop()
  firstName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: string;
}

export const userSchema = SchemaFactory.createForClass(Users);
