import morgan from 'morgan';
import process from 'process';
import { Router } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { usersController } from '../controlles/index.js';
import { authMiddleware } from '../middlewares/index.js';

/** Endpoint level: /api/ */
const devMode = (process.env.NODE_ENV === 'development');
const api = Router();

/** Middlewhare express in api level. */
if (devMode) api.use(morgan('tiny'));
api.use(bodyParser.json());
api.use(cookieParser());
api.use(fileUpload());

api.get('/', (req, res) => res.json({ msg: 'Api is ready!' }));

/**
 * Auth resources.
 */
api.get('/auth', authMiddleware.asUser, usersController.getSession);
api.post('/auth/login', usersController.login);
api.post('/auth/logout', usersController.logout);

/**
 * Users resources.
 */
api.post('/users/register', usersController.register);

/** Route 404 */
api.use((req, res) => {
    res.statusCode = 404;
    res.json({ success: false, msg: 'API tidak ditemukan!' });
});

export default api;
