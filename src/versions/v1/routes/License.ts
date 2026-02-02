
import express, { Express } from 'express';
import { CreateLicenseKey } from '../controller/License/CreateLicenseKey.js';
import { authenticateToken } from '../middleware/AuthenticateToken.js';


export default function (app: Express) {
    const router = express.Router();

    router.get('/create', authenticateToken, CreateLicenseKey);

    app.use('/v1/license', router);
}