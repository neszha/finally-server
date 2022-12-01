import morgan from 'morgan';
import process from 'process';
import { Router } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

/** Endpoint level: /api/ */
const devMode = (process.env.NODE_ENV === 'development');
const api = Router();

/** Middlewhare express in api level. */
if (devMode) api.use(morgan('tiny'));
api.use(bodyParser.json());
api.use(cookieParser());
api.use(fileUpload());

/**
 * Menagers account resources.
 */
// api.get('/managers', authManager.asAdministrator, managerController.gets);
// api.get('/managers/:id', authManager.asAdministrator, managerController.getById);
// api.post('/managers', authManager.asAdministrator, managerController.create);
// api.put('/managers/:id', authManager.asAdministrator, managerController.edit);
// api.delete('/managers', authManager.asAdministrator, managerController.destroy);
// api.delete('/managers/activity', authManager.asAdministrator, managerController.clearActivity);

/** Route 404 */
api.use((req, res) => {
    res.statusCode = 404;
    res.json({ success: false, msg: 'API tidak ditemukan!' });
});

export default api;
