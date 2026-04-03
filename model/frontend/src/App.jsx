import { useState } from 'react';
import InputModule from './components/InputModule';
import Dashboard from './components/Dashboard';
import { Shield } from 'lucide-react';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glassmorphism sticky top-0 z-50 p-4 shrink-0 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold font-outfit tracking-tight">
              AI Copyright <span className="gradient-text">Guardian</span>
            </h1>
          </div>
          <div className="text-sm text-slate-400 font-medium">Verify. Protect. Publish.</div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Input & Settings (4 cols wide) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glassmorphism rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-200">Submit Content</h2>
            <InputModule 
              onResult={(data) => setAnalysisResult(data)} 
              setLoading={setIsLoading} 
              isLoading={isLoading} 
            />
          </div>
          <div className="glassmorphism rounded-2xl p-6 hidden lg:block border border-slate-700/30">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">How It Works</h3>
            <ul className="text-sm text-slate-300 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">1.</span>
                <span>We generate embeddings for your text via OpenAI.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">2.</span>
                <span>Compare vectors against our sample intellectual property database.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">3.</span>
                <span>Determine legal risk based on Cosine Similarity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">4.</span>
                <span>Provide a safe rewrite if necessary.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Analysis Dashboard (8 cols wide) */}
        <div className="lg:col-span-8 flex flex-col gap-6" id="dashboard-container">
          {isLoading ? (
            <div className="w-full h-full min-h-[400px] flex items-center justify-center glassmorphism rounded-2xl">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-indigo-400 font-medium animate-pulse">Analyzing text fingerprints...</p>
              </div>
            </div>
          ) : analysisResult ? (
            <Dashboard result={analysisResult} />
          ) : (
            <div className="w-full h-full min-h-[400px] flex items-center justify-center glassmorphism rounded-2xl border-dashed border-2 border-slate-600/50 bg-slate-800/30">
              <div className="text-center p-8">
                <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-slate-400">Awaiting your content</h3>
                <p className="text-slate-500 mt-2 text-sm max-w-sm mx-auto">Upload a document or paste AI-generated text to run a full intellectual property analysis.</p>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;
