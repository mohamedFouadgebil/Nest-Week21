import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Model, Types } from 'mongoose';
import { OtpEnum, ProviderEnum } from 'src/common/enums/user.enum';
import { generateOTP } from 'src/common/utils/otp.utils';
import { HOtpDocument, Otp } from 'src/DB/Models/otp.model';
import { HUserDocument, User } from 'src/DB/Models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<HOtpDocument>,
    private jwtService: JwtService,
  ) {}

  async createOtp(userId: Types.ObjectId) {
    await this.otpModel.create([
      {
        createdBy: userId,
        code: generateOTP(),
        expiredAt: new Date(Date.now() + 2 * 60 * 1000),
        type: OtpEnum.EMAIL_VERIFICATION,
      },
    ]);
  }

  async signup(body: any) {
    const { email, firstName, lastName, password } = body;

    const checkUser = await this.userModel.findOne({ email });
    if (checkUser) throw new ConflictException('User Already Exists');

    const user = await this.userModel.create({
      email,
      firstName,
      lastName,
      password,
    });

    await this.createOtp(user._id);
    return { message: 'User Registered Successfully', user };
  }

  async resendOtp(resendOtp: any) {
    const { email } = resendOtp;

    const checkUser = await this.userModel
      .findOne({
        email,
        confirmEmail: { $exists: false },
      })
      .populate([{ path: 'otp', match: { type: OtpEnum.EMAIL_VERIFICATION } }]);

    if (!checkUser) throw new ConflictException('User Not Found');

    if (checkUser.otp?.length)
      throw new ConflictException('Otp Already Exists');

    await this.createOtp(checkUser._id);

    return { message: 'Otp Sent Successfully' };
  }

  async confirmEmail(confirmEmail: any) {
    const { email, otp } = confirmEmail;
    const user = await this.userModel
      .findOne({
        email,
        confirmEmail: { $exists: false },
      })
      .populate([{ path: 'otp', match: { type: OtpEnum.EMAIL_VERIFICATION } }]);
    if (!user) throw new NotFoundException('User Not Found');
    if (!user.otp.length) throw new NotFoundException('Otp Not Found');
    if (!(await compare(otp, user.otp[0].code))) {
      throw new BadRequestException('Invalid OTP');
    }
    await this.userModel.updateOne(
      { _id: user._id },
      { $set: { confirmEmail: new Date() }, $inc: { __v: 1 } },
    );
    return { message: 'User Confirmed Successfully' };
  }

  async login(login: any) {
    const { email, password } = login;
    const user = await this.userModel.findOne({
      email,
      confirmEmail: { $exists: true },
      provider: ProviderEnum.SYSTEM,
    });
    if (!user) throw new NotFoundException('User Not Found');
    if (!(await compare(password, user.password)))
      throw new BadRequestException('Invalid Email or Password');
    const jwtid = randomUUID();
    const accessToken = this.jwtService.sign(
      {
        id: user._id,
        email: user.email,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: Number(process.env.ACCESS_EXPIREDAT),
        jwtid,
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        id: user._id,
        email: user.email,
      },
      {
        secret: process.env.REFERSH_TOKEN_SECRET,
        expiresIn: Number(process.env.REFERSH_EXPIREDAT),
        jwtid,
      },
    );
    return {
      message: 'User LoggedIn Successfullys',
      creadentials: { accessToken, refreshToken },
    };
  }

  async getProfile(req: any) {
    return { message: 'Profile Fetched Successfully', data: req.user };
  }

  async uploadFile(files: Express.Multer.File[]) {
    return { message: 'File Uploaded Successfully', data: files };
  }
}
