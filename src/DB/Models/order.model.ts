import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { orderStatusEnum, PaymentMethodEnum } from 'src/common/enums/user.enum';

@Schema({
  timestamps: true,
})
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Cart',
  })
  cart: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
  })
  subTotal: number;

  @Prop({
    type: String,
    default: 0,
  })
  discount: number;

  @Prop({
    type: String,
    default: 0,
  })
  total: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
  })
  coupon?: Types.ObjectId;

  @Prop({
    type: String,
    enum: {
      values: Object.values(orderStatusEnum),
      message: '{VALUE} is not supported',
    },
    default: orderStatusEnum.PLACED,
  })
  status: string;

  @Prop({
    type: String,
    enum: {
      values: Object.values(PaymentMethodEnum),
      message: '{VALUE} is not supported',
    },
    default: PaymentMethodEnum.CASH,
  })
  paymentMethod: string;

  @Prop({
    type: String,
    required: true,
  })
  address: string;

  @Prop({
    type: String,
    required: true,
  })
  phone: string;
}

export const orderSchema = SchemaFactory.createForClass(Order);
export type OrderDocument = HydratedDocument<Order>;
export const OrderModel = MongooseModule.forFeature([
  { name: Order.name, schema: orderSchema },
]);
