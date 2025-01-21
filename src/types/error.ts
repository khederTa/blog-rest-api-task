export interface ErrorType extends Error {
  status?: number;
  message: string;
  stack?: string;
}
