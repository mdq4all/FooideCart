import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { FoodieReceiptEmail } from '../../../../emails/';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    
    const response = await req.json()
    
    try {
        await resend.emails.send({
            from: 'mdq4all@gmail.com',
            to: [response.email],
            subject: 'Foodie Cart Order Confirmation',
            react: FoodieReceiptEmail(),
        });
        return NextResponse.json({})

    } catch (error) {
        return NextResponse.json({ error })
    }
}