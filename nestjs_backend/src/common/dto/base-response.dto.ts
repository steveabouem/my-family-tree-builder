export class BaseResponseDto {
  readonly success: boolean;
  readonly message?: string;
  readonly data?: any;
}
