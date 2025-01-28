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
        variant: "destructive",
        title: "Error",
        description: "Invalid or expired offer letter link",
      });
    }
  }, [params.id, toast]);

  if (!offerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading offer letter...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <Card className="p-6">
          <OfferLetterTemplate data={offerData} />
        </Card>
      </div>
    </main>
  );
} 