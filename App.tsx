import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlayerCard } from './components/PlayerCard';
import { TrendCard } from './components/TrendCard';
import { AnalysisCharts } from './components/AnalysisCharts';
import { analyzeMarket } from './services/geminiService';
import { AnalysisResult, ViewState } from './types';
import { AlertTriangle, ExternalLink, Globe, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [currentSegment, setCurrentSegment] = useState<string>('');

  const handleSearch = async (segment: string) => {
    setViewState(ViewState.LOADING);
    setCurrentSegment(segment);
    setError('');
    setResult(null);

    try {
      const data = await analyzeMarket(segment);
      setResult(data);
      setViewState(ViewState.SUCCESS);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while analyzing the market.");
      setViewState(ViewState.ERROR);
    }
  };

  // Initial load
  useEffect(() => {
    handleSearch("Global Computer Workstation Market");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <Header onSearch={handleSearch} isLoading={viewState === ViewState.LOADING} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Loading State */}
        {viewState === ViewState.LOADING && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="h-8 w-64 bg-slate-800 rounded mb-4"></div>
            <div className="h-4 w-96 bg-slate-800 rounded mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-slate-800 rounded-xl"></div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {viewState === ViewState.ERROR && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-8 text-center max-w-2xl mx-auto mt-10">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-400 mb-2">Analysis Failed</h2>
            <p className="text-red-200 mb-6">{error}</p>
            <button 
              onClick={() => handleSearch(currentSegment)}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success State */}
        {viewState === ViewState.SUCCESS && result && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Executive Summary */}
            <section className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-900/50 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <LayoutDashboard className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-semibold tracking-wide text-sm uppercase">Executive Summary</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">{result.data.segment}</h2>
                  <p className="text-lg text-slate-300 leading-relaxed max-w-4xl">{result.data.summary}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase">Total Market Value (Est)</p>
                      <p className="text-lg font-semibold text-white">{result.data.totalMarketValueEst || "N/A"}</p>
                    </div>
                    <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase">Analysis Date</p>
                      <p className="text-lg font-semibold text-white">{result.data.analysisDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Charts */}
            <section>
               <AnalysisCharts players={result.data.players} />
            </section>

            {/* Key Players Grid */}
            <section>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" /> Key Market Players
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.data.players.map((player, idx) => (
                  <PlayerCard key={idx} player={player} />
                ))}
              </div>
            </section>

            {/* Trends Section */}
            <section>
              <h3 className="text-xl font-bold text-white mb-6">Emerging Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.data.trends.map((trend, idx) => (
                  <TrendCard key={idx} trend={trend} />
                ))}
              </div>
            </section>

            {/* Grounding / Sources */}
            {result.sources.length > 0 && (
              <section className="pt-8 border-t border-slate-800">
                <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
                   Data Sources & Grounding
                </h4>
                <div className="flex flex-wrap gap-3">
                  {result.sources.map((source, idx) => (
                    <a 
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-blue-400 text-xs rounded-full transition-colors border border-slate-700"
                    >
                      <span className="truncate max-w-[200px]">{source.title}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Idle State (Should technically be covered by initial useEffect, but just in case) */}
        {viewState === ViewState.IDLE && (
          <div className="text-center py-20 text-slate-500">
            <p>Initializing analysis...</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;