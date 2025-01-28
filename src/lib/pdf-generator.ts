import jsPDF from 'jspdf';
import { OfferLetterData } from '@/store/useOfferLetterStore';

export const generatePDF = async (data: OfferLetterData) => {
  const doc = new jsPDF();

  // Set font
  doc.setFont('helvetica');

  // Add company details
  doc.setFontSize(12);
  doc.text(new Date().toLocaleDateString(), 170, 20, { align: 'right' });

  // Add recipient details
  doc.setFontSize(12);
  doc.text(`Dear ${data.candidateName},`, 20, 40);

  // Add offer letter content
  doc.setFontSize(12);
  const text = `We are pleased to offer you the position of ${data.position} at ${data.companyName}, located in ${data.location}. We believe your skills and experience are an excellent match for our company.`;

  const splitText = doc.splitTextToSize(text, 170);
  doc.text(splitText, 20, 55);

  // Add offer details
  doc.text('The details of your offer are as follows:', 20, 80);
  doc.text(`• Position: ${data.position}`, 25, 90);
  doc.text(`• Start Date: ${new Date(data.startDate).toLocaleDateString()}`, 25, 100);
  doc.text(`• Annual Salary: $${Number(data.salary).toLocaleString()}`, 25, 110);
  doc.text(`• Location: ${data.location}`, 25, 120);

  // Add additional terms
  const terms =
    'This offer is contingent upon the successful completion of background checks and your ability to provide documentation proving your eligibility to work in the country.';
  const splitTerms = doc.splitTextToSize(terms, 170);
  doc.text(splitTerms, 20, 140);

  // Add closing
  doc.text('Sincerely,', 20, 200);
  doc.text('HR Manager', 20, 220);
  doc.text(data.companyName, 20, 230);

  // Add signature line for candidate
  doc.text('Acceptance of Offer:', 20, 250);
  doc.line(20, 270, 100, 270);
  doc.text(data.candidateName, 20, 280);
  doc.text('Date: ________________', 20, 290);

  // Save the PDF
  doc.save(`offer_letter_${data.candidateName.toLowerCase().replace(/\s+/g, '_')}.pdf`);
};

export const generatePDFBuffer = async (data: OfferLetterData): Promise<Buffer> => {
  const doc = new jsPDF();

  // Reuse the same PDF generation logic
  doc.setFont('helvetica');
  doc.setFontSize(12);
  doc.text(new Date().toLocaleDateString(), 170, 20, { align: 'right' });
  doc.text(`Dear ${data.candidateName},`, 20, 40);
  doc.setFontSize(12);
  const text = `We are pleased to offer you the position of ${data.position} at ${data.companyName}, located in ${data.location}. We believe your skills and experience are an excellent match for our company.`;

  const splitText = doc.splitTextToSize(text, 170);
  doc.text(splitText, 20, 55);

  doc.text('The details of your offer are as follows:', 20, 80);
  doc.text(`• Position: ${data.position}`, 25, 90);
  doc.text(`• Start Date: ${new Date(data.startDate).toLocaleDateString()}`, 25, 100);
  doc.text(`• Annual Salary: $${Number(data.salary).toLocaleString()}`, 25, 110);
  doc.text(`• Location: ${data.location}`, 25, 120);

  const terms =
    'This offer is contingent upon the successful completion of background checks and your ability to provide documentation proving your eligibility to work in the country.';
  const splitTerms = doc.splitTextToSize(terms, 170);
  doc.text(splitTerms, 20, 140);

  doc.text('Sincerely,', 20, 200);
  doc.text('HR Manager', 20, 220);
  doc.text(data.companyName, 20, 230);

  doc.text('Acceptance of Offer:', 20, 250);
  doc.line(20, 270, 100, 270);
  doc.text(data.candidateName, 20, 280);
  doc.text('Date: ________________', 20, 290);

  // Return as buffer instead of saving
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
};
