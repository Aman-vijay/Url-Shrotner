const dotenv = require('dotenv');
dotenv.config();

const prodStatus = process.env.PROD_STATUS || 'development';
export const frontendUrl = prodStatus === "false"? process.env.FRONTEND_URL : process.env.FRONTEND_URL_PROD;
export const backendUrl = prodStatus === "false"? process.env.BACKEND_URL : process.env.BACKEND_URL_PROD;