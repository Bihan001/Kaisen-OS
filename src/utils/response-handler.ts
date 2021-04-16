import CustomError from '../errors/custom-error';

export const SuccessResponse = (data: any, message?: string) => ({
  success: true,
  status: 'success',
  message: message || 'Success',
  data,
});

export const ErrorResponse = (err: Error) => ({
  success: false,
  status: err instanceof CustomError && `${err.statusCode}`.startsWith('4') ? 'fail' : 'error',
  message: err.message,
  error: err,
});
