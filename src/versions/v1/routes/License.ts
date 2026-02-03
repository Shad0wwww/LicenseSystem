
import express, { Express } from 'express';
import { CreateLicenseKey } from '../controller/License/CreateLicenseKey.js';
import { authenticateToken } from '../middleware/AuthenticateToken.js';
import { ratelimitRequests } from '../middleware/Ratelimiting.js';


export default function (app: Express) {
    const router = express.Router();

    router.get('/create', ratelimitRequests(5 * 60 * 1000, 20), authenticateToken, CreateLicenseKey);

    app.use('/v1/license', router);
}