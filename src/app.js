import express from 'express';
import logger from 'pino-http';
import indexRoute from "/Users/ivancanarisoy/Desktop/MASTER 1/integration/integration_projet/src/routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger({ level: process.env.NODE_ENV === 'test' ? 'error' : 'info' }));

app.use('/', indexRoute);

export default app;
