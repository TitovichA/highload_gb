import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment-dto';
import { EditCommentDto } from './dtos/edit-comment-dto';
import { HelperFileLoader } from '../../utils/HelperFileLoader';

const PATH_NEWS = '/news-static/';
HelperFileLoader.path = PATH_NEWS;

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/api/:idNews')
  create(
    @Param('idNews') idNews: mongoose.Types.ObjectId,
    @Body() comment: CreateCommentDto,
  ) {
    console.log(comment);
    return this.commentsService.create(idNews, comment);
  }

  @Put('/api')
  edit(@Query() query, @Body() comment: EditCommentDto) {
    const { idNews, idComment } = query;
    return this.commentsService.edit(idNews, idComment, comment);
  }

  @Get('/api/details/:idNews')
  get(@Param('idNews') idNews: mongoose.Types.ObjectId) {
    return this.commentsService.findAll(idNews);
  }

  @Delete('/api/details')
  remove(@Query() query) {
    const { idNews, idComment } = query;
    return this.commentsService.remove(idNews, idComment);
  }
}
