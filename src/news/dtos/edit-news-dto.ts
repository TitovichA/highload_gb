import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { CreateCommentDto } from '../comments/dtos/create-comment-dto';

export class EditNewsDto {
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.title)
  title?: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.description)
  description?: string;

  @ValidateIf((o) => o.cover)
  cover?: string;

  comments?: CreateCommentDto[];
}
