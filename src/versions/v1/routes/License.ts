
import express, { Express } from 'express';
import { CreateLicenseKey } from '../controller/License/CreateLicenseKey.js';



export default function (app: Express) {
    const router = express.Router();

    router.get('/create', CreateLicenseKey);

    app.use('/v1/license', router);
}