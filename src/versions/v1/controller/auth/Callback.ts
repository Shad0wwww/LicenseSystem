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
    const cookie: string = req.cookies['oauth_state'];
    const state: string = req.query.state as string;

    console.log('Callback modtaget med kode:', cookie);

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

    const discordUser = await getUserinformation(code) as DiscordUser;

    if (!discordUser) {
        return res.status(500).send({
            error: 'Failed to retrieve user information from Discord'
        });
    }

    try {

        await createUserTableOrUpdate(discordUser);

        res.clearCookie('oauth_state');


        return res.status(200).send("Callback received");
    } catch (error) {
        console.error('Error generating Discord Auth URL:', error);
        return res.status(500).send({ error: 'Error generating Discord Auth URL' });
    }
}


async function createUserTableOrUpdate(
    discordUser: DiscordUser
) {
    const { prisma } = await import('../../../../lib/prisma.js');

    return await prisma.$transaction(async (tx) => {

        let user = await tx.user.upsert({
            where: { email: discordUser.email },
            update: { user_name: discordUser.username },
            create: {
                email: discordUser.email,
                user_name: discordUser.username,

            }
        });

        await tx.account.upsert({
            where: {
                provider_providerAccountId: {
                    provider: 'discord',
                    providerAccountId: discordUser.id 
                }
            },
            update: {}, 
            create: {
                userId: user.id,
                provider: 'discord',
                providerAccountId: discordUser.id
            }
        });

        return user;
    });
}
