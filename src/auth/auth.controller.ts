import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { LoggingInterceptor } from 'src/common/interceptor/logger.interceptor';
import { ResponseInterceptor } from 'src/common/interceptor/response.interceptor';
import { extname } from 'node:path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@UseInterceptors(LoggingInterceptor, ResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: any) {
    return this.authService.signup(body);
  }

  @Post('/resend-otp')
  async resendOtp(@Body() resendOtp: any) {
    return await this.authService.resendOtp(resendOtp);
  }

  @Post('/confirm-email')
  async confirmEmail(@Body() confirmEmail: any) {
    return await this.authService.confirmEmail(confirmEmail);
  }

  @Post('/login')
  async login(@Body() login: any) {
    return await this.authService.login(login);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: any) {
    return await this.authService.getProfile(req);
  }

  @Post('/upload-file')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only Images Are Allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.authService.uploadFile(files);
  }
}
