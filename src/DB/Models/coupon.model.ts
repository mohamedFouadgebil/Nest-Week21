import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Coupon {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  })
  code: string;

  @Prop({
    type: Number,
    required: true,
    min: 1,
    max: 100,
  })
  discountPercent: number;

  @Prop({
    type: Date,
    required: true,
  })
  expiresAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy: Types.ObjectId;
}

export const couponSchema = SchemaFactory.createForClass(Coupon);
export type CouponDocument = HydratedDocument<Coupon>;
export const CoupontModel = MongooseModule.forFeature([
  { name: Coupon.name, schema: couponSchema },
]);
