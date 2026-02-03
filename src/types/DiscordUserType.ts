export type DiscordUser = {
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