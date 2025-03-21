// API configuration
const isProduction = process.env.NODE_ENV === 'production';

export const API_URL = isProduction 
  ? 'https://case-production.up.railway.app/api'
  : 'http://localhost:5001/api';
  
export const UPLOADS_URL = isProduction 
  ? 'https://case-production.up.railway.app/uploads'
  : 'http://localhost:5001/uploads'; 