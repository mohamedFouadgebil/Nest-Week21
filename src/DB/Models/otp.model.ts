import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { OtpEnum } from 'src/common/enums/user.enum';
import { emailEvents } from 'src/common/utils/events/email.events';
import { hash } from 'src/common/utils/hashing/hash';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Otp {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  code: string;

  @Prop({
    type: Date,
    required: true,
  })
  expiredAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: String,
    enum: OtpEnum,
    required: true,
  })
  type: string;
}

export const otpSchema = SchemaFactory.createForClass(Otp);

otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

otpSchema.pre(
  'save',
  async function (this: HOtpDocument & { wasNew: boolean; plainOtp?: string }) {
    this.wasNew = this.isNew;
    if (this.isModified('code')) {
      this.plainOtp = this.code;
      this.code = await hash(this.code);
      await this.populate('createdBy');
    }
  },
);

otpSchema.post('save', async function () {
  const that = this as HOtpDocument & { wasNew?: boolean; plainOtp?: string };

  console.log({
    wasNew: that.wasNew,
    otp: that.plainOtp,
    email: (that.createdBy as any).email,
    firstName: (that.createdBy as any).firstName,
  });

  if (that.wasNew && that.plainOtp) {
    emailEvents.emit('confirm-email', {
      to: (that.createdBy as any).email,
      otp: that.plainOtp,
    });
  }
});

export type HOtpDocument = HydratedDocument<Otp>;

export const OtpModel = MongooseModule.forFeature([
  { name: Otp.name, schema: otpSchema },
]);
