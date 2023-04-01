import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateNewsDto } from './dtos/create-news-dto';
import { UsersService } from '../users/users.service';
import { News, NewsDocument } from './news.schema';
import { EditNewsDto } from './dtos/edit-news-dto';

export interface NewsEdit {
  title?: string;
  description?: string;
  cover?: string;
}

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    private usersService: UsersService,
  ) {}

  async create(news: CreateNewsDto): Promise<News> {
    const user = await this.usersService.findById(news.userId);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Автор новости не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.newsModel.create(news);
  }

  findById(id: mongoose.Types.ObjectId): Promise<News> {
    return this.newsModel.findById(id).exec();
  }

  getAll(): Promise<News[]> {
    return this.newsModel.find().exec();
  }

  async edit(id: mongoose.Types.ObjectId, news: EditNewsDto): Promise<News> {
    return this.newsModel.findByIdAndUpdate(id, news, { new: true }).exec();
  }

  async remove(id: mongoose.Types.ObjectId): Promise<boolean> {
    const deletedNews = await this.newsModel.findByIdAndDelete(id);
    return !!deletedNews;
  }
}
