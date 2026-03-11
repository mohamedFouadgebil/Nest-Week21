import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from 'src/DB/Models/order.model';
import { Cart } from 'src/DB/Models/cart.model';
import { orderStatusEnum, PaymentMethodEnum } from 'src/common/enums/user.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  async create(
    cartId: string,
    address: string,
    phone: string,
    userId: Types.ObjectId,
  ) {
    const cart = await this.cartModel
      .findOne({ _id: cartId, user: userId })
      .populate('coupon');

    if (!cart) throw new NotFoundException('Cart Not Found');

    if (!cart.items.length) throw new BadRequestException('Cart is Empty');

    const order = await this.orderModel.create({
      user: userId,
      cart: cart._id,
      subTotal: cart.subTotal,
      discount: cart.discount || 0,
      total: cart.totalAfterDiscount || cart.subTotal,
      address,
      coupon: cart.coupon?._id,
      paymentMethod: PaymentMethodEnum.CASH,
      status: orderStatusEnum.PLACED,
      phone,
    });

    cart.items = [];
    await cart.save();

    return order;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
