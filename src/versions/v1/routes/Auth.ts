
import express, { Express } from 'express';
import { GenerateAuthUrlDiscord } from '../controller/auth/GenerateAuthUrlDiscord.js';
import { Callback } from '../controller/auth/Callback.js';


export default function (app: Express) {
    const router = express.Router();

    router.get('/discord/url', GenerateAuthUrlDiscord);
    router.get('/discord/callback', Callback);
    
    app.use('/v1/auth', router);
}