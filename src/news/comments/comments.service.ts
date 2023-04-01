import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment-dto';
import { NewsService } from '../news.service';
import { UsersService } from '../../users/users.service';
import mongoose from 'mongoose';
import { News } from '../news.schema';
import { EditCommentDto } from './dtos/edit-comment-dto';

type NewsAndCommentIndex = {
  _news: News;
  _commentIndex: number;
};

@Injectable()
export class CommentsService {
  constructor(
    private readonly newsService: NewsService,
    private readonly userService: UsersService,
  ) {}

  private async getNewsById(idNews: mongoose.Types.ObjectId): Promise<News> {
    const _news = await this.newsService.findById(idNews);
    if (!_news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return _news;
  }

  private async getNewsAndCommentIndexInNewsByIds(
    idNews: mongoose.Types.ObjectId,
    idComment: mongoose.Types.ObjectId,
  ): Promise<NewsAndCommentIndex> {
    try {
      const _news = await this.getNewsById(idNews);
      const _commentIndex = _news.comments.findIndex((comment) => {
        return comment._id.toString() === idComment.toString();
      });
      if (_commentIndex === -1) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Комментарий к новости не найден',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return { _news, _commentIndex };
    } catch (e) {
      return e;
    }
  }

  async create(
    idNews: mongoose.Types.ObjectId,
    comment: CreateCommentDto,
  ): Promise<News> {
    try {
      const _news = await this.getNewsById(idNews);
      const _user = await this.userService.findById(comment.userId);
      if (!_user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Пользователь не найден',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      comment._id = new mongoose.Types.ObjectId();
      _news.comments.push(comment);

      return this.newsService.edit(idNews, _news);
    } catch (e) {
      return e;
    }
  }

  async edit(
    idNews: mongoose.Types.ObjectId,
    idComment: mongoose.Types.ObjectId,
    comment: EditCommentDto,
  ): Promise<News | Error> {
    try {
      const { _news, _commentIndex } =
        await this.getNewsAndCommentIndexInNewsByIds(idNews, idComment);
      _news.comments[_commentIndex].message = comment.message;
      return this.newsService.edit(idNews, _news);
    } catch (e) {
      return e;
    }
  }

  async findAll(idNews: mongoose.Types.ObjectId): Promise<CreateCommentDto[]> {
    try {
      const _news = await this.getNewsById(idNews);
      return _news.comments;
    } catch (e) {
      return e;
    }
  }

  async remove(
    idNews: mongoose.Types.ObjectId,
    idComment: mongoose.Types.ObjectId,
  ): Promise<CreateCommentDto | Error> {
    try {
      const { _news, _commentIndex } =
        await this.getNewsAndCommentIndexInNewsByIds(idNews, idComment);
      const removedComment = _news.comments.splice(_commentIndex, 1);
      this.newsService.edit(idNews, _news);
      return removedComment[0];
    } catch (e) {
      return e;
    }
  }
}
