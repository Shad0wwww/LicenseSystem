import { Request, Response } from 'express';



export async function createUser(req: Request, res: Response): Promise<Response> {
    const { prisma } = await import('../../../../lib/prisma.js');

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }



    return res.status(201).json({ message: 'User created successfully' });
}