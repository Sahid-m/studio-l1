
export interface ClinicalTrialPaper {
  id: string;
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
