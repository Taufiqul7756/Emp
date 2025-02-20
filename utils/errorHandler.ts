import { AxiosError } from "axios";

interface ApiErrorResponse {
  success: boolean;
  message: string;
  data: Record<string, any>;
  error: string;
}

// Example of error Response
// {
//     "success": false,
//     "message": "",
//     "data": {},
//     "error": "Unique constraint failed : usIDNo"
// }

export const handleApiError = (
  error: unknown,
  defaultMessage: string = "An unexpected error occurred. Please try again later.",
): never => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const responseData = error.response?.data as ApiErrorResponse;
    
    // Get the most specific error message available
    const errorMessage = responseData?.error || responseData?.message || error.message || defaultMessage;

    switch (status) {
      case 400:
        throw new Error(`Bad Request: ${errorMessage}`);
      case 401:
        throw new Error(`Unauthorized: ${errorMessage}`);
      case 403:
        throw new Error(`Forbidden: ${errorMessage}`);
      case 404:
        throw new Error(`Resource not found: ${errorMessage}`);
      case 409:
        // Handle unique constraint violations and other conflicts
        if (errorMessage.includes('Unique constraint')) {
          const field = errorMessage.split(':')[1]?.trim() || 'field';
          throw new Error(`This ${field} is already in use. Please try another.`);
        }
        throw new Error(`Conflict: ${errorMessage}`);
      case 422:
        throw new Error(`Validation Error: ${errorMessage}`);
      case 429:
        throw new Error("Too many requests. Please try again later.");
      case 500:
      case 502:
      case 503:
      case 504:
        throw new Error(`Server Error: ${errorMessage}`);
      default:
        throw new Error(errorMessage);
    }
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    throw new Error(error.message);
  }

  throw new Error(defaultMessage);
};
