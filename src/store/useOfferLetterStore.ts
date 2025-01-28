import { create } from 'zustand';

export interface OfferLetterData {
  candidateName: string;
  position: string;
  startDate: string;
  salary: string;
  companyName: string;
  location: string;
}

interface OfferLetterStore {
  offerLetterData: OfferLetterData | null;
  isGenerating: boolean;
  setOfferLetterData: (data: OfferLetterData) => void;
  setIsGenerating: (status: boolean) => void;
  resetStore: () => void;
}

export const useOfferLetterStore = create<OfferLetterStore>((set) => ({
  offerLetterData: null,
  isGenerating: false,
  setOfferLetterData: (data) => set({ offerLetterData: data }),
  setIsGenerating: (status) => set({ isGenerating: status }),
  resetStore: () => set({ offerLetterData: null, isGenerating: false }),
})); 