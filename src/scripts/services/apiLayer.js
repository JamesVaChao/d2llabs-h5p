import axios from 'axios';

let restHostName; // Koa on local. Api Gateway on Dev/Prd.

console.log('WEBPACK_ENV', process.env.WEBPACK_ENV);
if (process.env.WEBPACK_ENV === 'local') {
  restHostName = `http://localhost:${process.env.KOA_BACKEND_PORT}/api`;
} else if (process.env.WEBPACK_ENV === 'dev') {
  restHostName = process.env.DEV_API_GATEWAY_URL;
} else if (process.env.WEBPACK_ENV === 'prd') {
  restHostName = process.env.PRD_API_GATEWAY_URL;
} else {
  restHostName = process.env.PRD_API_GATEWAY_URL;
}


const restAxiosInstance = axios.create({});

const createRestApiUrl = (endpoint) => restHostName + endpoint;

const generalHeaders = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default {
  restAxiosInstance,
  createRestApiUrl,
  generalHeaders,
};
