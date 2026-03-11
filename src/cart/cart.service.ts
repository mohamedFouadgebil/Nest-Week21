import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from 'src/DB/Models/cart.model';
import { Coupon } from 'src/DB/Models/coupon.model';
import { Product } from 'src/DB/Models/product.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Coupon.name) private coupontModel: Model<Coupon>,
  ) {}

  async addToCart(userId: Types.ObjectId, productId: string, quantity: number) {
    const product = await this.productModel.findById(
      new Types.ObjectId(productId),
    );

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    const price = product.salePrice;
    const total = price * quantity;

    let cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      cart = await this.cartModel.create({
        user: userId,
        items: [{ product: productId, quantity, price, total }],
      });
    } else {
      cart.items.push({
        product: new Types.ObjectId(productId),
        quantity,
        price,
        total,
      });
    }

    cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    await cart.save();

    return cart;
  }

  async findOne(userId: Types.ObjectId) {
    const cart = await this.cartModel.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'name salePrice images slug -_id',
    });

    if (!cart) throw new NotFoundException('Cart Not Found');

    return cart;
  }

  async update(userId: Types.ObjectId, productId: string, quantity: number) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart Not Found');

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1)
      throw new NotFoundException('Product Not Found In Cart');

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const item = cart.items[itemIndex];
      item.quantity = quantity;
      item.total = item.price * item.quantity;
    }

    cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    await cart.save();
    return cart;
  }

  async remove(userId: Types.ObjectId, productId: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart Not Found');

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) throw new NotFoundException('Product Not Found');

    cart.items.splice(itemIndex, 1);
    cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);

    await cart.save();
    return cart;
  }

  async applyCoupon(userId: Types.ObjectId, code: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart Not Found');

    const coupon = await this.coupontModel.findOne({ code });
    if (!coupon) throw new NotFoundException('Code Not Found');

    const now = new Date();
    if (coupon.expiresAt < now) {
      throw new BadRequestException('Coupon has Expired');
    }

    const discountAmount = (cart.subTotal * coupon.discountPercent) / 100;
    const totalAfterDiscount = cart.subTotal - discountAmount;

    cart.discount = coupon.discountPercent;
    cart.coupon = coupon._id;
    cart.totalAfterDiscount = totalAfterDiscount;

    await cart.save();
    return cart;
  }
}
