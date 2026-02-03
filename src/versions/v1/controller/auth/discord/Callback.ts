import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import getUserinformation from '../../../../../utils/Discord.js';
import { DiscordUser } from '../../../../../types/DiscordUserType.js';
import { UserManager } from '../../../../../manager/UserManager.js';
import { prisma } from '../../../../../lib/prisma.js';

export async function Callback(
    req: Request, 
    res: Response
): Promise<Response> {

    const code: string = req.query.code as string;
    const cookie: string = req.cookies['oauth_state'];
    const state: string = req.query.state as string;

    if (!code || !cookie) {
        return res.status(400).send({ 
            error: 'Missing code or cookie' 
        });
    }

    if (cookie !== state) {
        return res.status(400).send({ 
            error: 'Invalid state parameter' 
        });
    }

    const userManager = new UserManager(prisma);

    const discordUser = await getUserinformation(code) as DiscordUser;

    if (!discordUser) {
        return res.status(500).send({
            error: 'Failed to retrieve user information from Discord'
        });
    }

    try {

        var user = await userManager.findOrCreateFromDiscord(discordUser);

        const token = generateJsonWebToken(user.id);

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.clearCookie('oauth_state');


        return res.status(200).send("Callback received");
    } catch (error) {
        console.error('Error generating Discord Auth URL:', error);
        return res.status(500).send({ error: 'Error generating Discord Auth URL' });
    }
}

function generateJsonWebToken(userId: number): string {
    return jwt.sign(
        { userId }, 
        process.env.JWT_SECRET as string, 
        { expiresIn: '7d' }
    );
}