'use client';

import { useEffect, useState } from 'react';
import { OfferLetterTemplate } from '@/components/offer-letter-template';
import { useToast } from '@/hooks/use-toast';
import { OfferLetterData } from '@/store/useOfferLetterStore';
import { Card } from '@/components/ui/card';

export default function SharedOfferLetter({ params }: { params: { id: string } }) {
  const [offerData, setOfferData] = useState<OfferLetterData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const decodedData = JSON.parse(atob(params.id));
      setOfferData(decodedData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid or expired offer letter link',
      });
    }
  }, [params.id, toast]);

  if (!offerData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading offer letter...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <Card className="p-6">
          <OfferLetterTemplate data={offerData} />
        </Card>
      </div>
    </main>
  );
}
