import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Render,
  UploadedFile,
  //UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { CreateNewsDto } from './dtos/create-news-dto';
import { EditNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { MailService } from '../mail/mail.service';
//import { NewsEntity } from './news.entity';
//import { JwtAuthGuard } from '../auth/jwt-auth.guard';
//import { Roles } from '../auth/role/roles.decorator';
//import { Role } from '../auth/role/role.enum';
import mongoose from 'mongoose';
import { News } from './news.schema';

const PATH_NEWS = '/news-static/';
HelperFileLoader.path = PATH_NEWS;

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    private readonly mailService: MailService,
  ) {}

  @Get('/api/detail/:id')
  async get(@Param('id') id: mongoose.Types.ObjectId): Promise<News> {
    const news = this.newsService.findById(id);
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость была не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return news;
  }

  @Get('/api/all')
  async getAll(): Promise<News[]> {
    return this.newsService.getAll();
  }

  @Get('/all')
  @Render('news-list')
  async getAllView() {
    const news = await this.newsService.getAll();

    return { news, title: 'Список новостей!' };
  }

  @Get('create/new')
  @Render('create-news')
  async createView() {
    return {};
  }

  @Get('/detail/:id')
  @Render('news-detail')
  async getDetailView(@Param('id') id: mongoose.Types.ObjectId) {
    const news = await this.newsService.findById(id);
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость была не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return news;
  }

  //@UseGuards(JwtAuthGuard)
  //@Roles(Role.Admin, Role.Moderator)
  @Post('/api')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
    }),
  )
  async create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover,
  ): Promise<News> {
    console.log(news);
    const fileExtension = cover.originalname.split('.').reverse()[0];
    if (!fileExtension || !fileExtension.match(/(jpg|jpeg|png|gif)$/i)) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Неверный формат данных',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (cover?.filename) {
      news.cover = PATH_NEWS + cover.filename;
    }

    const createdNews = await this.newsService.create(news);

    return createdNews;
  }

  @Put('/api/:id')
  async edit(
    @Body() news: EditNewsDto,
    @Param('id') id: mongoose.Types.ObjectId,
  ): Promise<News> {
    console.log(news);
    console.log(id);
    const newsEditable = await this.newsService.edit(id, news);
    if (!newsEditable) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость была не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return newsEditable;
  }

  @Delete('/api/:id')
  async remove(@Param('id') id: mongoose.Types.ObjectId): Promise<string> {
    const isRemoved: boolean = await this.newsService.remove(id);
    throw new HttpException(
      {
        status: isRemoved ? HttpStatus.OK : HttpStatus.NOT_FOUND,
        message: isRemoved
          ? 'Новость удалена'
          : 'Передан неверный идентификатор',
      },
      HttpStatus.OK,
    );
  }
}
