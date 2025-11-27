import React from 'react';
import { TrendingUp, Minus, TrendingDown, AlertCircle } from 'lucide-react';
import { MarketTrend } from '../types';

interface TrendCardProps {
  trend: MarketTrend;
}

export const TrendCard: React.FC<TrendCardProps> = ({ trend }) => {
  const getIcon = () => {
    switch (trend.impact) {
      case 'High': return <TrendingUp className="text-emerald-400" />;
      case 'Medium': return <Minus className="text-yellow-400" />;
      case 'Low': return <TrendingDown className="text-slate-400" />;
      default: return <AlertCircle className="text-slate-400" />;
    }
  };

  const getBorderColor = () => {
    switch (trend.impact) {
      case 'High': return 'border-emerald-500/30 bg-emerald-500/5';
      case 'Medium': return 'border-yellow-500/30 bg-yellow-500/5';
      case 'Low': return 'border-slate-500/30 bg-slate-500/5';
      default: return 'border-slate-700 bg-slate-800';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getBorderColor()} transition-all hover:scale-[1.01]`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-slate-100">{trend.trend}</h4>
        <div title={`Impact: ${trend.impact}`}>
          {getIcon()}
        </div>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">{trend.description}</p>
      <div className="mt-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          trend.impact === 'High' ? 'bg-emerald-900/50 text-emerald-300' :
          trend.impact === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' :
          'bg-slate-700 text-slate-300'
        }`}>
          {trend.impact} Impact
        </span>
      </div>
    </div>
  );
};