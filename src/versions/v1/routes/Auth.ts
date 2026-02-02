
import express, { Express } from 'express';
import { GenerateAuthUrlDiscord } from '../controller/auth/discord/GenerateAuthUrlDiscord.js';
import { Callback } from '../controller/auth/discord/Callback.js';




export default function (app: Express) {
    const router = express.Router();

    router.get('/discord/url', GenerateAuthUrlDiscord);
    router.get('/discord/callback', Callback);
    
    app.use('/v1/auth', router);
}