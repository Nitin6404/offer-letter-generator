'use client';

import { OfferLetterTemplate } from '@/components/offer-letter-template';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { generatePDF } from '@/lib/pdf-generator';
import { OfferLetterData } from '@/store/useOfferLetterStore';
import { ShareableLink } from '@/types/share';
import { FileDown, Loader2, Share2 } from 'lucide-react';
import { useState } from 'react';
import { AuthDialog } from './auth-dialog';
import { EmailShareDialog } from './email-share-dialog';

interface OfferLetterPreviewProps {
  data: OfferLetterData;
}

export function OfferLetterPreview({ data }: OfferLetterPreviewProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'download' | 'email' | null>(null);

  const handleDownloadPDF = async () => {
    setPendingAction('download');
    setIsAuthDialogOpen(true);
  };

  const handleShareViaEmail = () => {
    setPendingAction('email');
    setIsAuthDialogOpen(true);
  };

  const handleAuthSuccess = async () => {
    if (pendingAction === 'download') {
      setIsDownloading(true);
      try {
        await generatePDF(data);
        toast({
          title: 'Success',
          description: 'PDF downloaded successfully!',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to download PDF',
        });
        console.log('Error: ', error);
      } finally {
        setIsDownloading(false);
      }
    } else if (pendingAction === 'email') {
      setIsEmailDialogOpen(true);
    }
    setPendingAction(null);
  };

  const generateShareableLink = (data: OfferLetterData): string => {
    const shareableData: ShareableLink = {
      data,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    };

    try {
      const jsonString = JSON.stringify(shareableData);
      console.log('JSON String:', jsonString);
      const base64String = btoa(jsonString);
      console.log('Base64 String:', base64String);
      const encodedString = encodeURIComponent(base64String);
      console.log('Encoded String:', encodedString);

      return `${window.location.origin}/offer-letter/${encodedString}`;
    } catch (error) {
      console.error('Error generating link:', error);
      throw new Error('Failed to generate shareable link');
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareableLink = generateShareableLink(data);
      await navigator.clipboard.writeText(shareableLink);

      toast({
        title: 'Success',
        description: 'Link copied to clipboard!',
      });
    } catch (error) {
      console.error('Copy error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to copy link',
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Preview</h2>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShareViaEmail}>Share via Email</DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>Copy Link</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={handleDownloadPDF} disabled={isDownloading} variant="outline">
              {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="mr-2 h-4 w-4" />
              )}
              Download PDF
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow-lg">
          <div id="offer-letter-template">
            <OfferLetterTemplate data={data} />
          </div>
        </div>
      </div>
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => {
          setIsAuthDialogOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />
      <EmailShareDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        offerLetterData={data}
      />
    </>
  );
}
