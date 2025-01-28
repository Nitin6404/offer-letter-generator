'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileDown, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { OfferLetterTemplate } from '@/components/offer-letter-template';
import { OfferLetterData } from '@/store/useOfferLetterStore';
import { generatePDF } from '@/lib/pdf-generator';
import { EmailShareDialog } from './email-share-dialog';
import { AuthDialog } from './auth-dialog';

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
      } finally {
        setIsDownloading(false);
      }
    } else if (pendingAction === 'email') {
      setIsEmailDialogOpen(true);
    }
    setPendingAction(null);
  };

  const handleCopyLink = async () => {
    try {
      const shareableLink = `${window.location.origin}/offer-letter/${btoa(JSON.stringify(data))}`;
      await navigator.clipboard.writeText(shareableLink);
      toast({
        title: 'Success',
        description: 'Link copied to clipboard!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy link',
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
