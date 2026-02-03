
import express, { Express } from 'express';
import { GenerateAuthUrlDiscord } from '../controller/auth/discord/GenerateAuthUrlDiscord.js';
import { Callback } from '../controller/auth/discord/Callback.js';
import { ratelimitRequests } from '../middleware/Ratelimiting.js';




export default function (app: Express) {
    const router = express.Router();

    router.get('/discord/url', ratelimitRequests(), GenerateAuthUrlDiscord);
    router.get('/discord/callback', ratelimitRequests(), Callback);
    
    app.use('/v1/auth', router);
}