
import type * as Core from 'express-serve-static-core';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




export default function (app: Core.Express) {
    app.get('/v1', (
        _req: Core.Request,
        res: Core.Response
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
        
        const routeFile = path.join('file://', __dirname, file);
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