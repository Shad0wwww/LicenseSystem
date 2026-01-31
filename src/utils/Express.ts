import bodyparser from 'body-parser';
import cors from 'cors';
import { Response, Request, Express } from 'express';
import express from 'express';
import { createServer } from 'http'

import routes from '../versions/v1/routes/RoutesLoader.js';


const app = express() as Express;

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3030',],
    credentials: true,
    optionSuccessStatus: 200,
} as const;


export default async function apiConnect(): Promise<void> {

    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: false }));

    app.use((
        err: {
            message: string
        },
        _req: Request,
        res: Response,
        _next: any
    ) => {
        res.status(422).send(
            { error: err.message }
        );
    });

    app.use(bodyparser.json({ limit: '50mb' }));

    app.use(bodyparser.urlencoded({ extended: true, limit: '50mb' }));
    const httpServer = createServer(app);


    routes(app);

    httpServer.listen(process.env.PORT || 3000, () => {
        console.log(`✔️  Express running on port ${process.env.PORT || 3000}`);
    });

}