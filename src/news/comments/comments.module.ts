import { forwardRef, Module } from '@nestjs/common';
import { NewsModule } from '../news.module';
import { UsersModule } from '../../users/users.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [forwardRef(() => NewsModule), UsersModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
