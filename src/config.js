/** Note: While building, process.env.NODE_ENV gets resolved via webpack plugin.
 * So its important to use NODE_ENV via destructuring */
const { NODE_ENV } = process.env;
const isDev = !NODE_ENV || NODE_ENV === 'development' || NODE_ENV === 'debug';
// all the prod features like logging, hide error stack trace,
const isProd = NODE_ENV === 'production';

// Set env string, used to load .env config
const env = (NODE_ENV === 'debug' ? 'development' : NODE_ENV) || 'development';

export default {
    env,
    __DEV__: isDev,
    __PROD__: isProd,
};
