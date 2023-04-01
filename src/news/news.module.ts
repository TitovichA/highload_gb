import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { News, newsSchema } from './news.schema';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: newsSchema }]),
    CommentsModule,
    MailModule,
    UsersModule,
  ],
  exports: [
    MongooseModule.forFeature([{ name: News.name, schema: newsSchema }]),
    NewsService,
  ],
})
export class NewsModule {}
