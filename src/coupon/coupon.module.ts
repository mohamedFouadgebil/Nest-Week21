import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { JwtService } from '@nestjs/jwt';
import { userModel } from 'src/DB/Models/user.model';
import { CoupontModel } from 'src/DB/Models/coupon.model';

@Module({
  imports: [userModel, CoupontModel],
  controllers: [CouponController],
  providers: [CouponService, JwtService],
})
export class CouponModule {}
