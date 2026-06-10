export interface Gap {
  id: string;
  x: number; // percentage coordinate on the image (0-100)
  y: number; // percentage coordinate on the image (0-100)
  timestamp: string;
  notes?: string;
}

export interface SuspicionEntry {
  id: string;
  timestamp: string; // "YYYY-MM-DD HH:mm:ss"
  coordinates: { x: number; y: number } | null;
  text: string;
  status: 'VERIFICADO' | 'PENDENTE';
}

export interface Question {
  id: string;
  text: string;
  placeholder?: string;
}

export type ScreenType = 'AGREEMENT' | 'CONFRONTATION' | 'QUESTIONS' | 'TRACEABILITY' | 'BLIND_MODE';
