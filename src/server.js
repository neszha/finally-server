import ip from 'ip';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import process from 'process';
import { createServer } from 'http';
import './database/index.js';
import apiRoutes from './api/index.js';

const ROOT = process.cwd();

/** Create express app. */
dotenv.config();
const app = express();
const httpServer = createServer(app);

/** Middlewhare express in main level. */
app.use(cors());
app.use('/', express.static(`${ROOT}/dist`));
app.use('/temp', express.static(`${ROOT}/storage/temp`));

/** Setup routes middlewhare express. */
app.use('/api', apiRoutes);

/** Starting HTTP server. */
const myIp = ip.address();
const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
    console.log(`[${process.pid}] Server starting and listening on ${myIp}:${port}`);
});
