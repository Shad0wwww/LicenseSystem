export enum DiscordScopes {
    IDENTIFY = 'identify',
    EMAIL = 'email',
    GUILDS = 'guilds',
    GUILDS_MEMBERS_READ = 'guilds.members.read',
    RELATIONSHIPS_READ = 'relationships.read',
}


export default async function getUserinformation(code: string) {
    const formdata = getFormData(code);
    const output = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: formdata,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/X-www-form-urlencoded',
        },
    });

    if (!output.ok) {
        throw new Error('Failed to get access token');
    }
    
    const outputJson: { access_token: string } = await output.json() as any;
    const accessToken: String = outputJson.access_token as String;
    const information = (await getUserInformation(accessToken.toString())).json();
    return information;
}

export function generateAuthLink(state : string, ...scopes: DiscordScopes[]): string {
    const form = new URLSearchParams({
        client_id: process.env['DISCORD_CLIENT_ID']!!,
        redirect_uri: process.env['DISCORD_REDIRECT_URI']!!,
        response_type: 'code',
        scope: scopes.join(' '),
        state: state,
    });

    return `https://discord.com/oauth2/authorize?${form}`
}

async function getUserInformation(accessToken: string) {
    return await fetch('https://discord.com/api/users/@me', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

function getFormData(code: string) {
    return new URLSearchParams({
        client_id: process.env["DISCORD_CLIENT_ID"]!!,
        client_secret: process.env['DISCORD_CLIENT_SECRET']!!,
        redirect_uri: process.env["DISCORD_REDIRECT_URI"]!!,
        code: code,
        grant_type: 'authorization_code',
    });

}