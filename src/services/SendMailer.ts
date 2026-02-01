import nodemailer from 'nodemailer';


export async function sendMail(
    email: string,
    rawKey?: string 
): Promise<void> {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });
    
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Test Email from License System',
        text: `This is a test email sent from the License System application. Your license key is: ${rawKey}`,
    };
    
    await transporter.sendMail(mailOptions);



}