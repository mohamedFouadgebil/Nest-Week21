import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from 'src/DB/Models/category.model';
import { Brand } from 'src/DB/Models/brand.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, image: string) {
    const category = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (category) throw new ConflictException('Category Already Exists');

    if (createCategoryDto.brands && createCategoryDto.brands.length > 0) {
      const invalidId = createCategoryDto.brands.find(
        (id) => !Types.ObjectId.isValid(id),
      );

      if (invalidId) {
        throw new BadRequestException(
          `Invalid Brand Id Format: ${invalidId.toString()}`,
        );
      }
      const foundBrands = await this.brandModel.find({
        _id: { $in: createCategoryDto.brands },
      });

      if (foundBrands.length !== createCategoryDto.brands?.length) {
        throw new BadRequestException('Missing Brands Ids');
      }
    }

    const newCategory = await this.categoryModel.create({
      ...createCategoryDto,
      image,
    });

    return newCategory;
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  async findOne(id: string) {
    return await this.categoryModel.findById(id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
