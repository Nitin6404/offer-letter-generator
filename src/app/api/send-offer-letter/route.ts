import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generatePDFBuffer } from '@/lib/pdf-generator';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, offerLetterData } = await request.json();

    const { data, error } = await resend.emails.send({
      from: "noreply@trakiz.tech",
      to: email,
      subject: `Offer Letter from ${offerLetterData.companyName}`,
      html: `
        <h1>Offer Letter</h1>
        <p>Dear ${offerLetterData.candidateName},</p>
        <p>Please find attached your offer letter for the position of ${offerLetterData.position} at ${offerLetterData.companyName}.</p>
        <p>Key Details:</p>
        <ul>
          <li>Position: ${offerLetterData.position}</li>
          <li>Start Date: ${new Date(offerLetterData.startDate).toLocaleDateString()}</li>
          <li>Location: ${offerLetterData.location}</li>
        </ul>
        <p>Best regards,<br/>HR Team</p>
      `,
      attachments: [
        {
          filename: `offer_letter_${offerLetterData.candidateName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
          content: await generatePDFBuffer(offerLetterData), // You'll need to implement this
        },
      ],
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
} 