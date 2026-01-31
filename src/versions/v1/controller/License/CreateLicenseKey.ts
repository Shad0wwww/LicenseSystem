import { Request, Response } from 'express';
import { DiscordScopes, generateAuthLink } from '../../../../utils/Discord.js';
const { prisma } = await import('../../../../lib/prisma.js');

export async function CreateLicenseKey(
    req: Request, 
    res: Response
): Promise<Response> {

    const RequestBody = {
        product: String,
        userId: Number,
        max_activations: Number,
        expiresAt: Date,
    } = req.body;

    if (!RequestBody.product || 
        !RequestBody.userId || 
        !RequestBody.max_activations || 
        !RequestBody.expiresAt) {
        return res.status(400).send({ 
            error: 'Missing required fields in request body' 
        });
    }

    const generatedLicenseKey = generateLicenseKey();

    await prisma.license.create({
        data: {
            product: RequestBody.product,
            userId: RequestBody.userId,
            key: generatedLicenseKey,
            expiresAt: RequestBody.expiresAt,
            max_activations: RequestBody.max_activations,
        }

    });

    try {

        return res.status(200).send("s");
    } catch (error) {
        console.error('Error generating Discord Auth URL:', error);
        return res.status(500).send({ error: 'Error generating Discord Auth URL' });
    }
}


function generateLicenseKey(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let licenseKey = '';
    const keyLength = 16;
    for (let i = 0; i < keyLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        licenseKey += characters[randomIndex];
    }
    return licenseKey;
}