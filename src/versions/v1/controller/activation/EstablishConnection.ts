import { Request, Response } from 'express';


export async function EstablishConnection(
    req: Request, 
    res: Response
): Promise<Response> {

    


    try {

    


        return res.status(200).send("Callback received");
    } catch (error) {
        console.error('Error generating Discord Auth URL:', error);
        return res.status(500).send({ error: 'Error generating Discord Auth URL' });
    }
}


