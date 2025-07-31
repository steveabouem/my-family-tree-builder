// Common utility types and enums
export enum Gender {
  Male = 1,
  Female = 2
}

export enum MaritalStatus {
  Single = 'single',
  Married = 'married',
  Divorced = 'divorced',
  Widowed = 'widowed',
  Separated = 'separated'
}

export interface ApiResponse<T = any> {
  error: boolean;
  code: number;
  message?: string;
  payload: T;
  sessionId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export enum KinshipEnum {
  'sibling' = 'sibling',
  'parent' = 'parent',
  'spouse' = 'spouse',
  'child' = 'child'
} 