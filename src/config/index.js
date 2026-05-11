export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:1211/api/v1',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const AUTH_CONFIG = {
  TOKEN_KEY: 'le_access_token',
  USER_KEY: 'le_current_user',
  GUEST_KEY: 'le_guest_id',
};
