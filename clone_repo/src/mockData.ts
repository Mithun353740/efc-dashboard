import { Player, Leader } from './types';

export const MOCK_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'VORTEX KINETIC',
    number: '3',
    position: 'FORWARD',
    ovr: 95,
    win: 24,
    loss: 2,
    draw: 1,
    goalsScored: 45,
    goalsConceded: 12,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    form: ['W', 'W', 'W', 'D', 'W']
  },
  {
    id: '2',
    name: 'MARCUS STERLING',
    number: '10',
    position: 'MIDFIELDER',
    ovr: 92,
    win: 18,
    loss: 2,
    draw: 4,
    goalsScored: 22,
    goalsConceded: 10,
    image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=400&auto=format&fit=crop',
    form: ['W', 'D', 'W', 'W', 'L']
  },
  {
    id: '3',
    name: 'ELENA RODRIGUEZ',
    number: '7',
    position: 'FORWARD',
    ovr: 89,
    win: 16,
    loss: 5,
    draw: 3,
    goalsScored: 31,
    goalsConceded: 15,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400&auto=format&fit=crop',
    form: ['W', 'L', 'W', 'D', 'W']
  },
  {
    id: '4',
    name: 'JULIAN THORNE',
    number: '4',
    position: 'DEFENDER',
    ovr: 87,
    win: 14,
    loss: 6,
    draw: 4,
    goalsScored: 5,
    goalsConceded: 22,
    image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=400&auto=format&fit=crop',
    form: ['L', 'W', 'D', 'W', 'L']
  },
];

export const THE_LEGION: Player[] = [
  { id: '5', name: 'JAXSON VANE', number: '1', position: 'GOALKEEPER', ovr: 85, win: 12, loss: 8, draw: 2, goalsScored: 0, goalsConceded: 18, image: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=400&auto=format&fit=crop', form: [] },
  { id: '6', name: 'LEO ROSSI', number: '8', position: 'MIDFIELDER', ovr: 84, win: 10, loss: 4, draw: 8, goalsScored: 12, goalsConceded: 14, image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=400&auto=format&fit=crop', form: [] },
  { id: '7', name: 'SOFIA CHEN', number: '5', position: 'DEFENDER', ovr: 86, win: 15, loss: 3, draw: 4, goalsScored: 4, goalsConceded: 11, image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=400&auto=format&fit=crop', form: [] },
  { id: '8', name: 'KIAN O\'HARA', number: '11', position: 'WINGER', ovr: 83, win: 11, loss: 9, draw: 2, goalsScored: 18, goalsConceded: 20, image: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=400&auto=format&fit=crop', form: [] },
  { id: '9', name: 'MIKAEL SUND', number: '6', position: 'CENTER BACK', ovr: 82, win: 8, loss: 12, draw: 2, goalsScored: 2, goalsConceded: 25, image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=400&auto=format&fit=crop', form: [] },
  { id: '10', name: 'ARJUN GUPTA', number: '9', position: 'STRIKER', ovr: 88, win: 17, loss: 2, draw: 3, goalsScored: 38, goalsConceded: 14, image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=400&auto=format&fit=crop', form: [] },
];


export const LEADERS: Leader[] = [
  {
    id: '1',
    name: 'ARTHUR THORNE',
    role: 'CLUB PRESIDENT',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    quote: 'Victory is calculated, chaos is controlled.',
    initials: 'PRES',
  },
  {
    id: '2',
    name: 'DR. ELENA VOSS',
    role: 'TACTICAL LEAD',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    quote: 'Optimizing performance through kinetic data.',
    initials: 'TAC',
  },
  {
    id: '3',
    name: 'MARCUS VANE',
    role: 'STRATEGIC DIRECTOR',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    quote: 'Building the foundation for future legends.',
    initials: 'STRAT',
  },
];
