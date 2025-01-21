export type ValidationErrorResult = {
  field: string;
  message: string;
};
export type ResponseObject<T = any> = {
  success: boolean;
  message?: string;
  user?: Omit<T, "password">;
  errors?: ValidationErrorResult[];
  data?: T | T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};
