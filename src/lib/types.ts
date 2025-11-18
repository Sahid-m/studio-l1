

export interface ClinicalTrialPaper {
  id: string;
  type: 'paper';
  sourceUrl: string;
  title: string;
  principalInvestigator: string;
  publishedDate: string;
  summary: string;
  imageUrl: string;
  imageHint: string;
  status: 'Recruiting' | 'Completed' | 'Terminated';
  phase: 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Phase 4';
  sponsor: string;
}

export interface VideoSummary {
    id: string;
    type: 'video';
    title: string;
    paperId: string; // The ID of the paper it summarizes
    videoUrl: string;
    thumbnailUrl: string;
    imageHint: string;
    summary: string;
}

export type FeedItem = ClinicalTrialPaper | VideoSummary;
