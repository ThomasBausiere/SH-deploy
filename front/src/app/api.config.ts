// src/app/api.config.ts
const isProd = window.location.hostname === 'gw-sh.net';

export const API_BASE_URL = isProd
  ? 'https://api.gw-sh.net/api'
  : 'http://localhost:8080/api';
