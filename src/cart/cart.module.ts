import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtService } from '@nestjs/jwt';
import { CartModel } from 'src/DB/Models/cart.model';
import { userModel } from 'src/DB/Models/user.model';
import { ProductModel } from 'src/DB/Models/product.model';
import { CoupontModel } from 'src/DB/Models/coupon.model';

@Module({
  imports: [CartModel, userModel, ProductModel, CoupontModel],
  controllers: [CartController],
  providers: [CartService, JwtService],
})
export class CartModule {}
