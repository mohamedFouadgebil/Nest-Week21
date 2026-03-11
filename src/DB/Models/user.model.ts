import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum, ProviderEnum } from '../../common/enums/user.enum';
import { HOtpDocument } from './otp.model';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20,
    trim: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20,
    trim: true,
  })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.provider === ProviderEnum.SYSTEM;
    },
  })
  password: string;

  @Prop({ type: Date })
  confirmEmail: Date;

  @Prop({ type: String })
  @Prop({
    type: String,
    enum: {
      values: Object.values(GenderEnum),
      message: '{VALUE} is not a valid gender',
    },
    default: GenderEnum.MALE,
  })
  gender: string;

  @Prop({
    type: String,
    enum: Object.values(ProviderEnum),
    default: ProviderEnum.SYSTEM,
  })
  provider: ProviderEnum;

  @Virtual()
  otp: HOtpDocument[];
}

export type HUserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('otp', {
  localField: '_id',
  foreignField: 'createdBy',
  ref: 'Otp',
});

UserSchema.virtual('fullName')
  .get(function (this: any) {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (this: any, value: string) {
    const [firstName, lastName] = value.split(' ');
    this.set({ firstName, lastName });
  });

export const userModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  },
]);
