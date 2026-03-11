import { GenderEnum, ProviderEnum } from 'src/common/enums/user.enum';
import z from 'zod';

export const createUserSchema = z
  .strictObject({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    username: z.string().min(2).max(50),
    email: z.email(),
    password: z.string(),
    confirmPassword: z.string(),
    gender: z.enum(GenderEnum as any).optional(),
    provider: z.enum(ProviderEnum as any).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password and ConfirmPassword do not match',
    path: ['confirmPassword'],
  });
