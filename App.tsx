import React, { useState, useCallback } from 'react';
import { NovelHook, AppState } from './types';
import { generateHooks } from './services/geminiService';
import { HookCard } from './components/HookCard';

const App: React.FC = () => {
  const [hooks, setHooks] = useState<NovelHook[]>([]);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleGenerate = useCallback(async () => {
    setAppState(AppState.GENERATING);
    setErrorMsg('');
    setHooks([]);

    try {
      const response = await generateHooks();
      
      const hooksWithIds = response.hooks.map((h, i) => ({
        ...h,
        id: `hook-${Date.now()}-${i}`,
      }));
      
      setHooks(hooksWithIds);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "灵感枯竭了，请稍后再试...");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-md">
              <span className="text-white font-serif font-bold text-xl">Z</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              知乎纯爱·导语生成器
            </h1>
          </div>
          <div className="text-xs sm:text-sm text-slate-500 hidden sm:block font-medium">
            Powered by Gemini 3.0 Pro
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Intro / Control Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-indigo-600 uppercase bg-indigo-50 rounded-full">
            纯爱双男主 · 甜宠搞笑 · 现实向
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            一键生成<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">神级反转</span>开篇
          </h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            融合「遗憾暗恋」的深情与「掉马搞笑」的张力。
            <br className="hidden sm:block" />
            全员恶人，全员戏精，拒绝一切枯燥套路。
          </p>
          
          <button
            onClick={handleGenerate}
            disabled={appState === AppState.GENERATING}
            className={`
              relative inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full shadow-lg text-white 
              transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200
              ${appState === AppState.GENERATING 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'}
            `}
          >
            {appState === AppState.GENERATING ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                正在构思神转折...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                立即生成
              </>
            )}
          </button>
          
          {errorMsg && (
             <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm animate-fade-in">
               {errorMsg}
             </div>
          )}
        </div>

        {/* Results Grid */}
        {appState === AppState.SUCCESS && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
            {hooks.map((hook, index) => (
              <HookCard key={hook.id} hook={hook} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {appState === AppState.IDLE && (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl h-64 flex flex-col items-center justify-center text-slate-400 bg-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <p className="font-medium">点击按钮，AI 将为您创作十个神仙开局</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;