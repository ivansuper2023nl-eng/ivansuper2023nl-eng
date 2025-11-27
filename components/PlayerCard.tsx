import React from 'react';
import { Player } from '../types';
import { Trophy, Target, ShieldCheck, Zap } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-colors shadow-lg flex flex-col h-full">
      <div className="p-5 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-800/50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {player.category === 'Leader' && <Trophy className="w-5 h-5 text-yellow-500" />}
              {player.name}
            </h3>
            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              player.category === 'Leader' ? 'bg-blue-900/50 text-blue-200 border border-blue-700' :
              player.category === 'Challenger' ? 'bg-purple-900/50 text-purple-200 border border-purple-700' :
              'bg-slate-700 text-slate-300 border border-slate-600'
            }`}>
              {player.category}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Market Share</p>
            <p className="text-2xl font-bold text-white">{player.marketShareEst}%</p>
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Key Strengths
          </h4>
          <div className="flex flex-wrap gap-2">
            {player.strengths.map((s, idx) => (
              <span key={idx} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" /> Recent Strategy
          </h4>
          <p className="text-sm text-slate-400 italic">"{player.recentMoves}"</p>
        </div>
      </div>
    </div>
  );
};