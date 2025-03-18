import axios from "axios";

/**
 * Handles API errors and returns standardized error messages
 */
export function handleApiError(error: unknown, defaultMessage: string): Error {
  console.error("API Error:", error);
  
  if (axios.isAxiosError(error) && error.response) {
    const errorMessage = error.response.data?.message || defaultMessage;
    console.log(`Error response: ${errorMessage}, Status: ${error.response.status}`);
    return new Error(errorMessage);
  }
  
  console.log(`Default error: ${defaultMessage}`);
  return new Error(defaultMessage);
}
