// API constants
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
  
export const API_ENDPOINTS = {
  SHORTEN_URL: "/url/shorten",
  URL_INFO: "/url/info",
  DELETE_URL: "/url/delete",
  URL_ANALYTICS: "/url/analytics",
};

// Cookie constants
export const COOKIES = {
  SAVED_URLS: "saved_urls",
  MAX_AGE: 60 * 60 * 24 * 30, // 30 days
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
