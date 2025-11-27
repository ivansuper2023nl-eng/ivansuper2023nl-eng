export interface Player {
  name: string;
  marketShareEst: number; // Percentage estimate
  revenueEst?: string;
  strengths: string[];
  weaknesses?: string[];
  recentMoves: string;
  category: 'Leader' | 'Challenger' | 'Niche';
}

export interface MarketTrend {
  trend: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface MarketData {
  segment: string;
  totalMarketValueEst?: string;
  players: Player[];
  trends: MarketTrend[];
  analysisDate: string;
  summary: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  data: MarketData;
  sources: GroundingSource[];
}

export enum ViewState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}