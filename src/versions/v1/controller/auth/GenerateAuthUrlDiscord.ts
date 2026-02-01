import { Request, Response } from 'express';
import { DiscordScopes, generateAuthLink } from '../../../../utils/Discord.js';


export async function GenerateAuthUrlDiscord(
    _req: Request, 
    res: Response
): Promise<Response> {
    try {
        const state = crypto.randomUUID();

        res.cookie('oauth_state', state, { 
            httpOnly: true, 
            secure: true, 
            maxAge: 10 * 60 * 1000
        });
    
        const url: String = generateAuthLink(state, DiscordScopes.IDENTIFY, DiscordScopes.EMAIL);
        return res.status(200).send({ url });
    } catch (error) {
        console.error('Error generating Discord Auth URL:', error);
        return res.status(500).send({ error: 'Error generating Discord Auth URL' });
    }
}

