import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Brand } from 'src/DB/Models/brand.model';
import { Category } from 'src/DB/Models/category.model';
import { Product } from 'src/DB/Models/product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    userId: Types.ObjectId,
    files: Express.Multer.File[],
  ) {
    const brandsExists = await this.brandModel.findById(createProductDto.brand);

    if (!brandsExists) return new NotFoundException('Brand Not Found');

    const categpryExists = await this.categoryModel.findById(
      createProductDto.category,
    );

    if (!categpryExists) return new NotFoundException('Category Not Found');

    const images: string[] = [];
    if (files?.length) {
      for (const file of files) {
        images.push(`./src/uploads/products/${file.filename}`);
      }
    }

    const product = await this.productModel.create({
      ...createProductDto,
      images,
      createdBy: userId,
    });

    return product;
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, UpdateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
