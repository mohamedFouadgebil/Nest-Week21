import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

import { JwtService } from '@nestjs/jwt';
import { BrandModel } from 'src/DB/Models/brand.model';
import { CategoryModel } from 'src/DB/Models/category.model';
import { ProductModel } from 'src/DB/Models/product.model';
import { userModel } from 'src/DB/Models/user.model';

@Module({
  imports: [BrandModel, CategoryModel, ProductModel, userModel],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
})
export class ProductModule {}
