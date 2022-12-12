import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config.js';
import errorHandler from './middleware/errorHandler.js';
import fourOhFour from './middleware/fourOhFour.js';
import root from './routes/root.js';

const app = express();
const test = 'Denis';
console.log(test);

// Apply most middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // @ts-ignore
    origin: config.clientOrigins[config.nodeEnv],
  })
);
app.use(helmet());
app.use(morgan('tiny'));

// Apply routes before error handling
app.use('/', root);

// Apply error handling last
app.use(fourOhFour);
app.use(errorHandler);

export default app;
