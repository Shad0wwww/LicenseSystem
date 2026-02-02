import { Request, Response } from 'express';
import { createHash, randomBytes } from 'crypto';
import { sendMail } from '../../../../services/SendMailer.js';
import jwt from 'jsonwebtoken';
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

        const userExists = await DoesUserExist(parseInt(req.userId.toString()));


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

        const userEmail = await getUserEmail(parseInt(req.userId.toString()));

        if (userEmail) {
            await sendMail(userEmail, rawKey);
        }

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

async function getUserEmail(
    userId: number
): Promise<string | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
    }); 
    return user ? user.email : null;
}

async function DoesUserExist(
    userId: string | number
): Promise<Boolean> {
    return prisma.user.findUnique({
        where: { id: parseInt(userId.toString()) }
    }).then(user => {
        return user ? true : false;
    });
}

function hashKey(
    key: string
): string {
    return createHash('sha256').update(key).digest('hex');
}