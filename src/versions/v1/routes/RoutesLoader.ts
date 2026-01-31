import { Request, Response, Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function (app: Express) {
    app.get('/v1', (
        _req: Request,
        res: Response
    ) => {
        res.json({
            message: 'Welcome to API version 1'
        });
    });

    fs.readdirSync(__dirname).forEach((file) => {
        if (file === 'RoutesLoader.js' || 
            file === 'RoutesLoader.ts' || 
            file.endsWith('.map')
        ) {
            return;
        }
        
        const routeFile = pathToFileURL(path.join(__dirname, file)).href;
        console.log(`⌛   ${file}`);

        void import(routeFile)
            .then(route => {
                route.default(app);
            })
            .catch(error => {
                console.error(`Error loading route ${file}: ${error}`);
            });
    });







}