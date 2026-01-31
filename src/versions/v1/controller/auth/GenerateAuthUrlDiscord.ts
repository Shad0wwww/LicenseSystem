import { Request, Response } from 'express';
import { DiscordScopes, generateAuthLink } from '../../../../utils/Discord.js';


export async function GenerateAuthUrlDiscord(_req: Request, res: Response): Promise<Response> {
    const state = crypto.getRandomValues(new Uint8Array(16)).join('');

    const { prisma } = await import('../../../../lib/prisma.js');

    await prisma.user.create({
        data: { 
            state: state,
            email: '',
            user_name: ''
        }
    });

    try {
        const url = generateAuthLink(state, DiscordScopes.IDENTIFY, DiscordScopes.EMAIL);
        return res.status(200).send({ url });
    } catch (error) {
        console.error('Error generating Discord Auth URL:', error);
        return res.status(500).send({ error: 'Error generating Discord Auth URL' });
    }
}

