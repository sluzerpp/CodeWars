import axios, { InternalAxiosRequestConfig } from 'axios';

const HOST = 'http://localhost:5000';

const $host = axios.create({
  baseURL: HOST,
});

const $authHost = axios.create({
  baseURL: HOST,
});

const authInterceptor = (config: InternalAxiosRequestConfig) => {
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
  config.headers['ngrok-skip-browser-warning'] = 'please';
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
