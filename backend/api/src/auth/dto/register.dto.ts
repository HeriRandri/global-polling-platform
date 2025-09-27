export class RegisterDto {
  email: string;
  password: string; // 8+ char, on vérifiera côté service
}
