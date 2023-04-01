import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CreateCommentDto } from './comments/dtos/create-comment-dto';

export type NewsDocument = News & Document;

@Schema()
export class News {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  cover: string;

  @Prop()
  userId: mongoose.Schema.Types.ObjectId;

  @Prop(
    raw([
      {
        _id: { type: mongoose.Types.ObjectId },
        userId: { type: mongoose.Types.ObjectId },
        message: { type: String },
      },
    ]),
  )
  comments: CreateCommentDto[];
}

export const newsSchema = SchemaFactory.createForClass(News);
