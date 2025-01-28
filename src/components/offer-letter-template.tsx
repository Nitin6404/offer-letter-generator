import { format } from 'date-fns';
import { OfferLetterData } from '@/store/useOfferLetterStore';

interface OfferLetterTemplateProps {
  data: OfferLetterData;
}

export const OfferLetterTemplate = ({ data }: OfferLetterTemplateProps) => {
  const formattedDate = format(new Date(data.startDate), 'MMMM dd, yyyy');
  const currentDate = format(new Date(), 'MMMM dd, yyyy');

  return (
    <div className="space-y-6 bg-white p-8 text-black">
      <div className="text-right">{currentDate}</div>

      <div className="space-y-4">
        <p>Dear {data.candidateName},</p>

        <p>
          We are pleased to offer you the position of {data.position} at {data.companyName}, located
          in {data.location}. We believe your skills and experience are an excellent match for our
          company.
        </p>

        <div className="space-y-2">
          <p>The details of your offer are as follows:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Position: {data.position}</li>
            <li>Start Date: {formattedDate}</li>
            <li>Annual Salary: ${Number(data.salary).toLocaleString()}</li>
            <li>Location: {data.location}</li>
          </ul>
        </div>

        <p>
          This offer is contingent upon the successful completion of background checks and your
          ability to provide documentation proving your eligibility to work in the country.
        </p>

        <p>
          We are excited about the prospect of you joining our team and believe you will be a great
          addition to {data.companyName}.
        </p>

        <p>
          Please confirm your acceptance of this offer by signing below and returning a copy of this
          letter by{' '}
          {format(new Date(new Date().setDate(new Date().getDate() + 7)), 'MMMM dd, yyyy')}.
        </p>

        <div className="mt-12 space-y-8">
          <div className="space-y-4">
            <p>Sincerely,</p>
            <div>
              <div className="w-48 border-t border-black pt-2">
                <p>HR Manager</p>
                <p>{data.companyName}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p>Acceptance of Offer:</p>
            <div>
              <div className="w-48 border-t border-black pt-2">
                <p>{data.candidateName}</p>
                <p>Date: ________________</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
