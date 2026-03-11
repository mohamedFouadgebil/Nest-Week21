import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { JwtService } from '@nestjs/jwt';
import { userModel } from 'src/DB/Models/user.model';
import { CartModel } from 'src/DB/Models/cart.model';
import { OrderModel } from 'src/DB/Models/order.model';
import { CoupontModel } from 'src/DB/Models/coupon.model';

@Module({
  imports: [userModel, CartModel, OrderModel, CoupontModel],
  controllers: [OrderController],
  providers: [OrderService, JwtService],
})
export class OrderModule {}
