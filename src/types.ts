export interface Player {
  id: string;
  name: string;
  number: string;
  position?: string;
  ovr: number;
  win: number;
  loss: number;
  draw: number;
  goalsScored: number;
  goalsConceded: number;
  image: string;
  form: string[];
  device?: string;
  uid?: string;
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  initials: string;
  playerId?: string;
}

export interface MatchRecord {
  id: string;
  timestamp: number;
  p1Id: string;
  p1Name: string;
  p1Score: number;
  p2Id?: string;
  p2Name: string;
  p2Score: number;
}
