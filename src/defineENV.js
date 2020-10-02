import dotenv from 'dotenv';
import config from './config';
import paths from '../configs/paths';

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
// dotenv.config({ path: `${paths.envPath}/.env.common` });
dotenv.config({ path: `${paths.envPath}/.env.${config.env}` });

const { NODE_ENV } = process.env;
const isDev = !NODE_ENV || NODE_ENV === 'development';

process.env.MONGO_URI = `${process.env.MONGO_HOST}/${isDev ? process.env.DATABASE : 'amrita'}`;
