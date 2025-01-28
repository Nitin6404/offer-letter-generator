import { OfferLetterData } from '@/store/useOfferLetterStore';

export type ShareableLink = {
  data: OfferLetterData;
  expiresAt: number; // Unix timestamp
};
