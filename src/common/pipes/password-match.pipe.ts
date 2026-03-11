import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class PasswordMatchPipe implements PipeTransform<any, any> {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type === 'body') {
      const { password, confirmPassword } = value as {
        password?: string;
        confirmPassword?: string;
      };

      if (password !== confirmPassword) {
        throw new BadRequestException(
          'Password and ConfirmPassword do not match',
        );
      }
    }
    return value;
  }
}
