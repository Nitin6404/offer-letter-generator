'use client';

import { OfferLetterTemplate } from '@/components/offer-letter-template';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { OfferLetterData } from '@/store/useOfferLetterStore';
import { ShareableLink } from '@/types/share';
import { Loader2 } from 'lucide-react';
import { Suspense, use, useEffect, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

function OfferLetterContent({ id }: { id: string }) {
  const [offerData, setOfferData] = useState<OfferLetterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const decodeData = async () => {
      try {
        const decoded = decodeURIComponent(id);
        const base64Decoded = atob(decoded);
        const parsedData = JSON.parse(base64Decoded);

        // If the data doesn't have expiresAt, it's the old format
        if (!('expiresAt' in parsedData)) {
          setOfferData(parsedData as OfferLetterData);
        } else {
          const decodedData = parsedData as ShareableLink;
          if (decodedData.expiresAt < Date.now()) {
            throw new Error('This link has expired');
          }
          setOfferData(decodedData.data);
        }
      } catch (error) {
        console.error('Decode error:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            error instanceof Error ? error.message : 'Invalid or expired offer letter link',
        });
      } finally {
        setIsLoading(false);
      }
    };

    decodeData();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!offerData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Invalid or expired offer letter link</p>
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

export default function SharedOfferLetter({ params }: PageProps) {
  const { id } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <OfferLetterContent id={id} />
    </Suspense>
  );
}
