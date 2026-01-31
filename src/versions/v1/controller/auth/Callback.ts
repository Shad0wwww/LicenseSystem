import { Request, Response } from 'express';
import getUserinformation from '../../../../utils/Discord.js';



type DiscordUser = {
    id: string;
    username: string;
    discord_id: string;
    discriminator: string;
    avatar: string;
    email: string;
    verified: boolean;
    locale: string;
    mfa_enabled: boolean;
    flags: number;
    premium_type: number;
    public_flags: number;
};



export async function Callback(
    req: Request, 
    res: Response
): Promise<Response> {

    const code: string = req.query.code as string;
    const state: string = req.query.state as string;

    if (!code || !state) {
        return res.status(400).send({ 
            error: 'Missing code or state in query parameters' 
        });
    }

    const discordUser = await getUserinformation(code) as DiscordUser;

    if (!discordUser) {
        return res.status(500).send({
            error: 'Failed to retrieve user information from Discord'
        });
    }

    try {
        await createUserTableOrUpdate(discordUser, state);
        return res.status(200).send("Callback received");
    } catch (error) {
        console.error('Error generating Discord Auth URL:', error);
        return res.status(500).send({ error: 'Error generating Discord Auth URL' });
    }
}


async function createUserTableOrUpdate(
    discordUser: DiscordUser, 
    state: string
): Promise<void> {
    const { prisma } = await import('../../../../lib/prisma.js');

    await prisma.$transaction(async (tx) => {
        
        await tx.user.upsert({
            where: { email: discordUser.email },
            update: {
                user_name: discordUser.username,
                state: "" 
            },
            create: {
                email: discordUser.email,
                user_name: discordUser.username,
                state: ""
            }
        });

        await prisma.user.deleteMany({
            where: {
                state: state,
                email: '',
            }
        })
    });      
}
