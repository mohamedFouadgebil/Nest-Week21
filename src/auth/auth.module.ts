import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { userModel } from 'src/DB/Models/user.model';
import { OtpModel } from 'src/DB/Models/otp.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [userModel, OtpModel, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
