'use client';

import { OfferLetterForm } from '@/components/offer-letter-form';
import { OfferLetterPreview } from '@/components/offer-letter-preview';
import { useOfferLetterStore } from '@/store/useOfferLetterStore';

export default function Home() {
  const { offerLetterData } = useOfferLetterStore();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <OfferLetterForm />
          {offerLetterData && <OfferLetterPreview data={offerLetterData} />}
        </div>
      </div>
    </main>
  );
}
