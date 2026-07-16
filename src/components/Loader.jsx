import React from 'react';

const Loader = ({ fullScreen, spinner, skeleton }) => {
  // 1. Full Screen Glassmorphic Spinner
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-md">
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 shadow-2xl">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-slate-700 dark:text-slate-200 font-medium tracking-wide">Loading secure assets...</p>
        </div>
      </div>
    );
  }

  // 2. Inline Spinner (e.g., inside buttons)
  if (spinner) {
    return (
      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block"></div>
    );
  }

  // 3. Skeleton Loading UI (e.g., inside cards/dashboards)
  if (skeleton) {
    return (
      <div className="w-full space-y-4">
        <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded-md w-1/3 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6 animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-4/5 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return null;
};

export default Loader;
