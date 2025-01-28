'use client';

import { useOfferLetterStore } from '@/store/useOfferLetterStore';
import { OfferLetterForm } from '@/components/offer-letter-form';
import { OfferLetterPreview } from '@/components/offer-letter-preview';

export default function Home() {
  const { offerLetterData } = useOfferLetterStore();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <OfferLetterForm />
          {offerLetterData && <OfferLetterPreview data={offerLetterData} />}
        </div>
      </div>
    </main>
  );
}
