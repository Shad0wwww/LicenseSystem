import { Request, Response } from 'express';


export async function DeleteLicenseKey(
    req: Request, res: Response
): Promise<Response> {

    return res.status(500).json({ error: 'Intern server fejl' });
}