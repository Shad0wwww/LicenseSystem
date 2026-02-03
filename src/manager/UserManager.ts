import { PrismaClient } from "../../generated/prisma/index.js";
import { DiscordUser } from "../types/DiscordUserType.js";

export class UserManager {
    private prismaClient: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;
    }

    async getUserWithLicenses(userId: string) {
        return this.prismaClient.user.findUnique({
            where: { id: Number(userId) },
            include: {
                licenses: true,
            },
        });
    }

    async findOrCreateFromDiscord(discordUser: DiscordUser) {
        return await this.prismaClient.$transaction(async (tx) => {

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

    async DoesUserExist(
        userId: string | number
    ): Promise<Boolean> {

        return this.prismaClient.user.findUnique({
            where: { id: parseInt(userId.toString()) }
        }).then(user => {
            return user ? true : false;
        })
    }

    async getUserEmail(
        userId: number
    ): Promise<string | null> {
        const user = await this.prismaClient.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });
        return user ? user.email : null;
    }

}