import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsMongoId,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(25)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(5000)
  description?: string;

  @IsMongoId()
  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsMongoId({ each: true })
  brands?: Types.ObjectId[];
}
