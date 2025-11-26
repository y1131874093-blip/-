import React, { useState } from 'react';
import { NovelHook } from '../types';

interface HookCardProps {
  hook: NovelHook;
  index: number;
}

export const HookCard: React.FC<HookCardProps> = ({ hook, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hook.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Process content to handle newlines nicely
  const formattedContent = hook.content.split('\n').map((line, i) => (
    <p key={i} className={`mb-2 ${line.startsWith('「') ? 'text-indigo-700 font-medium' : 'text-slate-700'}`}>
      {line}
    </p>
  ));

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-slate-100 flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">
              #{index + 1}
            </span>
            <div className="flex gap-2">
                {hook.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
        
        <div className="prose prose-slate max-w-none text-base leading-relaxed font-serif">
          {formattedContent}
        </div>
      </div>

      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
        <button
          onClick={handleCopy}
          className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
            copied ? 'text-green-600' : 'text-slate-500 hover:text-indigo-600'
          }`}
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              已复制
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              复制文本
            </>
          )}
        </button>
      </div>
    </div>
  );
};
