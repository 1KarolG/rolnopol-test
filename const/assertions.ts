// Static assertion constants for test verification values

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

// API Response Assertions
export const API_ASSERTIONS = {
  OPENAPI_VERSION: '3.0.0',
  SUCCESS_STATUS: true,
  TOKEN_COOKIE_NAME: 'rolnopolToken',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/login',
  HEALTHCHECK: '/healthcheck',
} as const;

// Page Content Assertions
export const PAGE_ASSERTIONS = {
  MIN_STRING_LENGTH: 0,
  EXPECT_TITLE_PRESENT: true,
  EXPECT_CONTENT_HEIGHT_GREATER_THAN: 0,
  EXPECT_CONTENT_WIDTH_GREATER_THAN: 0,
  LOADING_TEXT: 'Loading...',
} as const;

// URL Patterns
export const URL_PATTERNS = {
  HOME: '/',
  LOGIN: '/login.html',
  PROFILE: '/profile.html',
  LOGIN_REGEX: /\/login/,
  LOGIN_HTML_REGEX: /\/login\.html$/,
  PROFILE_HTML_REGEX: /\/profile\.html$/,
  ROOT_REGEX: /\//,
} as const;

// User Greeting Patterns
export const GREETING_PATTERNS = {
  USER_GREETING: /welcome|hello|greetings|hi|biography|profile|user/i,
  PROFILE_HEADER: /profile|welcome|user/i,
} as const;

// Login Heading Patterns
export const LOGIN_PATTERNS = {
  HEADING: /login|sign in/i,
} as const;

// Error Message Patterns
export const ERROR_PATTERNS = {
  INVALID_CREDENTIALS: /invalid|incorrect|failed|error|credentials/i,
} as const;

// Cookie Assertions
export const COOKIE_ASSERTIONS = {
  TOKEN_NAME: 'rolnopolToken',
  EXPECT_DEFINED: true,
  EXPECT_UNDEFINED: undefined,
} as const;

// Element Count Assertions
export const ELEMENT_ASSERTIONS = {
  MIN_COUNT: 0,
  MAX_LINKS_TO_CHECK: 5,
} as const;
