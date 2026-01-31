import * as dotenv from 'dotenv';
const { prisma } = await import('./lib/prisma.js');

dotenv.config({ 
	path: ['.env']
});

import apiConnect from './utils/Express.js';


async function main(): Promise<void> {

	await Promise.allSettled([
		prisma.$connect().then(() => {
			console.log('✔️  Connected to the database');
		}),
		apiConnect(),
	]);

}

main().then(() => {
	console.log('✔️  Everything is running!');
}).catch(err => {
	console.error(err);
});

process.on('uncaughtException', err => {
	console.error('Uncaught exception: ', err);
	prisma.$disconnect();
	process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	prisma.$disconnect();
	process.exit(1);
});