
import express, { Express } from 'express';


export default function (app: Express) {
    const router = express.Router();


    app.use('/v1/activation', router);
}