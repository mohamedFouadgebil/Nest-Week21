import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  })
  name: string;

  @Prop({
    type: String,
    minLength: 3,
    maxLength: 1000,
  })
  description: string;

  @Prop({
    type: String,
    minLength: 3,
    maxLength: 50,
  })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: [String],
    required: true,
  })
  images: string[];

  @Prop({
    type: Number,
    required: true,
  })
  originalPrice: number;

  @Prop({
    type: Number,
    default: 0,
  })
  discountPercent: number;

  @Prop({
    type: Number,
    required: true,
  })
  salePrice: number;

  @Prop({
    type: Number,
    required: true,
  })
  stock: number;

  @Prop({
    type: Number,
    default: 0,
  })
  soldItems: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }],
  })
  brands: Types.ObjectId[];

  @Prop({
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  })
  category: Types.ObjectId;
}

export const productSchema = SchemaFactory.createForClass(Product);

productSchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
});

export type ProductDocument = HydratedDocument<Product>;

export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: productSchema },
]);
