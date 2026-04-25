import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '../../FirebaseContext';
import { saveTournament } from '../../lib/store';
import { Tournament, TournamentFormat, Team } from '../../types';
import { Trophy, Users, Calendar, ArrowRight, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';
import { bergerRoundRobin, seededKnockout, generateGroupStage } from '../../lib/fixtureGen';
import { getSeasonInfo } from '../../lib/utils';

interface TournamentSetupProps {
  onComplete: (tournamentId: string) => void;
  onCancel: () => void;
}

export function TournamentSetup({ onComplete, onCancel }: TournamentSetupProps) {
  const { players } = useFirebase();
  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [format, setFormat] = useState<TournamentFormat | null>(null);
  const [name, setName] = useState('');
  const [season] = useState(getSeasonInfo(new Date()).name);
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const generateTournament = async () => {
    if (!format || !name) return;
    setIsGenerating(true);

    try {
      const teams: Team[] = Array.from(selectedPlayers).map((pId) => {
        const player = players.find(p => p.id === pId);
        return {
          id: pId as string,
          name: player?.name || 'Unknown',
          shortName: player?.name?.substring(0, 3).toUpperCase() || 'UNK',
          logo: player?.image,
        };
      });

      // Pad to power of 2 if knockout
      if (format === 'knockout') {
        let size = 2;
        while (size < teams.length) size *= 2;
        let counter = 1;
        while (teams.length < size) {
          teams.push({
            id: `bye-${counter}`,
            name: `BYE ${counter}`,
            shortName: 'BYE',
          });
          counter++;
        }
      }

      let fixtures: any[] = [];
      let groups: any[] = [];
      const currentStage = format === 'groups' ? 'groups' : format;

      if (format === 'league') {
        fixtures = bergerRoundRobin(teams, 2, 'league', 0); // 2 legs
      } else if (format === 'round_robin') {
        fixtures = bergerRoundRobin(teams, 1, 'round_robin', 0); // 1 leg
      } else if (format === 'knockout') {
        fixtures = seededKnockout(teams, 1, 1);
      } else if (format === 'groups') {
        const result = generateGroupStage(teams, 4);
        groups = result.groups;
        fixtures = result.fixtures;
      }

      const newTournament: Tournament = {
        id: `t_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name,
        season,
        type: format,
        archived: false,
        currentStage,
        teams,
        fixtures,
        createdAt: Date.now()
      };

      if (groups.length > 0) {
        newTournament.groups = groups;
      }

      await saveTournament(newTournament);
      onComplete(newTournament.id);
    } catch (error) {
      console.error('Failed to generate tournament', error);
      alert(`Failed to initialize engine: ${error instanceof Error ? error.message : String(error)}`);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#050508]/95 backdrop-blur-xl z-50 overflow-y-auto">
      <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <button 
            onClick={onCancel}
            className="text-slate-500 hover:text-white transition-colors text-sm font-black uppercase tracking-widest"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`w-16 h-1.5 rounded-full transition-colors duration-500 ${i <= step ? 'bg-indigo-500' : 'bg-[#1e1e32]'}`}
              />
            ))}
          </div>
          <div className="w-16 text-right text-slate-500 text-sm font-black">
            {step} / 3
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* STEP 1: Format */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Select Format</h2>
              <p className="text-slate-400 mb-10 font-bold tracking-widest text-xs uppercase">How will the competition be structured?</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { id: 'league', icon: Shield, label: 'Full League', desc: 'Home & Away round robin. Long term season.' },
                  { id: 'round_robin', icon: Users, label: 'Round Robin', desc: 'Single match against every opponent.' },
                  { id: 'knockout', icon: Trophy, label: 'Knockout', desc: 'Single elimination bracket. High stakes.' },
                  { id: 'groups', icon: Calendar, label: 'Group + KO', desc: 'World Cup style. Groups into knockouts.' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id as TournamentFormat)}
                    className={`p-6 rounded-3xl border-2 text-left transition-all ${
                      format === f.id 
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]' 
                        : 'border-[#1e1e32] bg-[#0a0a12] hover:border-indigo-500/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center ${format === f.id ? 'bg-indigo-500 text-white' : 'bg-[#1e1e32] text-slate-400'}`}>
                      <f.icon className="w-6 h-6" />
                    </div>
                    <h3 className={`text-lg font-black mb-2 ${format === f.id ? 'text-white' : 'text-slate-300'}`}>{f.label}</h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">{f.desc}</p>
                  </button>
                ))}
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={handleNext}
                  disabled={!format}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black hover:bg-slate-200"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Details & Teams */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 max-w-3xl"
            >
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Tournament Details</h2>
              <p className="text-slate-400 mb-10 font-bold tracking-widest text-xs uppercase">Name your competition and assign competitors</p>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Tournament Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. KickOff World Cup"
                      className="w-full bg-[#0a0a12] border border-[#1e1e32] rounded-2xl px-6 py-4 text-white font-bold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Season Label</label>
                    <input 
                      type="text" 
                      value={season}
                      readOnly
                      className="w-full bg-[#050508] border border-[#1e1e32] rounded-2xl px-6 py-4 text-slate-500 font-bold focus:outline-none transition-all cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Roster Selection</label>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      {selectedPlayers.size} Teams Selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 pb-4">
                    {players.map(p => {
                      const isSelected = selectedPlayers.has(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            const newSet = new Set(selectedPlayers);
                            if (isSelected) newSet.delete(p.id);
                            else newSet.add(p.id);
                            setSelectedPlayers(newSet);
                          }}
                          className={`p-4 rounded-2xl border text-center transition-all ${
                            isSelected ? 'bg-indigo-500/10 border-indigo-500' : 'bg-[#0a0a12] border-[#1e1e32] hover:border-slate-600'
                          }`}
                        >
                          <img src={p.image} alt={p.name} className={`w-12 h-12 mx-auto rounded-xl object-cover mb-3 ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#050508]' : ''}`} />
                          <div className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-400'}`}>{p.name}</div>
                          <div className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">OVR {p.ovr}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-between">
                <button 
                  onClick={handlePrev}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!name || selectedPlayers.size < 2}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black hover:bg-slate-200"
                >
                  Review <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Summary */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 max-w-2xl mx-auto text-center w-full"
            >
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(99,102,241,0.4)]">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Ready to Generate</h2>
              <p className="text-slate-400 mb-12 font-bold tracking-widest text-sm uppercase leading-relaxed max-w-lg mx-auto">
                The AI scheduling engine will now compute fixtures, brackets, and team seedings based on your parameters.
              </p>

              <div className="bg-[#0a0a12] border border-[#1e1e32] rounded-3xl p-8 text-left mb-12">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Tournament</div>
                    <div className="text-xl font-black text-white tracking-tight">{name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Format</div>
                    <div className="text-xl font-black text-indigo-400 tracking-tight capitalize">{format?.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Competitors</div>
                    <div className="text-xl font-black text-white tracking-tight">{selectedPlayers.size} Teams</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Season</div>
                    <div className="text-xl font-black text-white tracking-tight">{season}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button 
                  onClick={handlePrev}
                  disabled={isGenerating}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button 
                  onClick={generateTournament}
                  disabled={isGenerating}
                  className="flex items-center gap-3 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_10px_40px_rgba(99,102,241,0.4)] hover:shadow-[0_10px_60px_rgba(99,102,241,0.6)]"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  Initialize Engine
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
