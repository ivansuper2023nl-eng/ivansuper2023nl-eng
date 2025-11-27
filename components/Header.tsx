import React, { useState } from 'react';
import { Monitor, Search, Loader2 } from 'lucide-react';

interface HeaderProps {
  onSearch: (segment: string) => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, isLoading }) => {
  const [searchValue, setSearchValue] = useState("High-Performance Engineering Workstations");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-none">Market<span className="text-blue-500">Lens</span></h1>
              <p className="text-xs text-slate-400">Workstation Intelligence</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:w-auto flex-1 max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 border border-slate-600 rounded-lg leading-5 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                placeholder="E.g., Media & Entertainment Workstations, Data Science Laptops..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute inset-y-1 right-1 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </header>
  );
};