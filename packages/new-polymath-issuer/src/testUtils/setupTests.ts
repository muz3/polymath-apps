import '@babel/polyfill';
import { mockEthereumBrowser } from './helpers';

import dotenv from 'dotenv';

const res = dotenv.config({ path: './config/.env.tests' });

// Override environment variables since we are in test mode and need to isolate them
process.env = {
  ...process.env,
  ...res.parsed,
};

mockEthereumBrowser();
