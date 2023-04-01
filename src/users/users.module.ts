import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users, userSchema } from './users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: userSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
    UsersService,
    MongooseModule.forFeature([{ name: Users.name, schema: userSchema }]),
  ],
})
export class UsersModule {}
