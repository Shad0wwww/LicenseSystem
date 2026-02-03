import { Request, Response } from 'express';
import { createHash, randomBytes } from 'crypto';
import { sendMail } from '../../../../services/SendMailer.js';
import { UserManager } from '../../../../manager/UserManager.js';
const { prisma } = await import('../../../../lib/prisma.js');

interface CreateLicenseInput {
    product: string;
    max_activations: number;
    expiresAt: string; 
}

export async function CreateLicenseKey(
    req: Request, res: Response
): Promise<Response> {

    const auth_token = req.cookies['auth_token'];

    if (!auth_token) {
        return res.status(401).json({
            error: 'Uautoriseret adgang'
        });
    }

    const userManager = new UserManager(prisma);

    try {
        const { 
            product, 
            max_activations, 
            expiresAt 
        }: CreateLicenseInput = req.body;

        if (!product || !req.userId || !max_activations || !expiresAt) {
            return res.status(400).json({ 
                error: 'Manglende felter i forespørgslen' 
            });
        }

        const userExists = await userManager.DoesUserExist(parseInt(req.userId.toString()));


        if (!userExists) {
            return res.status(404).json({ 
                error: 'Bruger ikke fundet' 
            });
        }


        const rawKey = randomBytes(16).toString('hex').toUpperCase();
        const hashedKey = hashKey(rawKey);

        await prisma.license.create({
            data: {
                product,
                userId: parseInt(req.userId.toString()),
                key: hashedKey,
                expiresAt: new Date(expiresAt), 
                max_activations: parseInt(max_activations.toString()),
            }
        });

        const userEmail = await userManager.getUserEmail(parseInt(req.userId.toString()));

        if (!userEmail) {
            return res.status(401).json({ error: "Kunne ikke finde emailen" });
        }

        await sendMail(userEmail, rawKey);

        return res.status(201).json({
            message: 'Gem denne nøgle sikkert, den vises kun én gang!',
            key: rawKey
        });

    } catch (error: TypeError | any) {
        console.error('Fejl ved oprettelse af licens:', error);

        if (error.code === 'P2002') {
            return res.status(500).json({ 
                error: 'Nøgle-kollision, prøv igen.' 
            });
        }

        return res.status(500).json({ error: 'Intern server fejl' });
    }
}




function hashKey(
    key: string
): string {
    return createHash('sha256').update(key).digest('hex');
}