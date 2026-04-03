import { Download, AlertTriangle, CheckCircle, Info, Edit3, BookOpen } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function Dashboard({ result }) {
  if (!result) return null;

  const {
    similarityScore,
    riskLevel,
    matchedSource,
    ownershipExplanation,
    rewriteSuggestion,
    originalText
  } = result;

  const riskColors = {
    Low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    High: 'text-rose-400 bg-rose-400/10 border-rose-400/30'
  };
  
  const iconMap = {
    Low: <CheckCircle className="w-5 h-5" />,
    Medium: <AlertTriangle className="w-5 h-5" />,
    High: <AlertTriangle className="w-5 h-5" />
  };

  const downloadReport = () => {
    const element = document.getElementById('report-content');
    const opt = {
      margin:       1,
      filename:     `IP_Report_${Date.now()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, backgroundColor: '#0f172a' },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold font-outfit text-slate-100">Analysis Results</h2>
        <button 
          onClick={downloadReport}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          Export PDF
        </button>
      </div>

      <div id="report-content" className="flex flex-col gap-6">
        
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Similarity Score */}
          <div className="glassmorphism p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">Similarity</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-100">{similarityScore}%</span>
                <span className="text-sm text-slate-400">match</span>
              </div>
            </div>
            
            <div className="relative w-20 h-20 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent"
                  className="text-slate-800" />
                 <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray={`${similarityScore * 2.26} 226`} 
                  className={similarityScore > 80 ? 'text-rose-500' : similarityScore > 40 ? 'text-amber-500' : 'text-indigo-500'} />
               </svg>
            </div>
          </div>

          {/* Risk Level */}
          <div className={`glassmorphism p-6 rounded-2xl flex flex-col justify-center border ${riskColors[riskLevel]}`}>
            <p className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-2">Legal Risk</p>
            <div className="flex items-center gap-3">
              {iconMap[riskLevel]}
              <span className="text-3xl font-bold font-outfit uppercase tracking-wide">{riskLevel}</span>
            </div>
            <p className="text-xs mt-2 opacity-80">
              {riskLevel === 'High' ? 'Significant IP infringement detected. Rewrite required.' : 
               riskLevel === 'Medium' ? 'Moderate overlap. Review suggested changes.' : 
               'Content appears highly original.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Ownership Explainer */}
         <div className="glassmorphism p-6 rounded-2xl flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
               <BookOpen className="w-5 h-5" />
               <h3 className="font-semibold text-slate-200">Ownership Explainer</h3>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 prose prose-invert max-w-none text-sm text-slate-300 flex-1 overflow-y-auto max-h-48">
              {ownershipExplanation}
            </div>
         </div>

         {/* Source Detection */}
         <div className="glassmorphism p-6 rounded-2xl flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-blue-400">
               <Info className="w-5 h-5" />
               <h3 className="font-semibold text-slate-200">Matched Source</h3>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex-1">
              {matchedSource ? (
                <>
                  <p className="font-medium text-slate-200 mb-2">Found in: <span className="text-blue-400">{matchedSource.title}</span></p>
                  <p className="text-xs text-slate-400 italic line-clamp-4">"{matchedSource.snippet}"</p>
                </>
              ) : (
                <p className="text-sm text-slate-400 flex items-center justify-center h-full">No significant sources found in public database.</p>
              )}
            </div>
         </div>
       </div>

        {/* Actionable Rewrite Card */}
        {rewriteSuggestion && (
          <div className="glassmorphism p-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30 overflow-hidden">
            <div className="bg-slate-900/90 w-full h-full rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Edit3 className="w-5 h-5" />
                  <h3 className="font-semibold text-slate-100">Safe Rewrite Suggestion</h3>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(rewriteSuggestion)}
                  className="text-xs px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-md transition-colors"
                >
                  Copy
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-900/10 border border-rose-500/20 rounded-lg p-3">
                  <p className="text-xs font-semibold text-rose-400 mb-2">ORIGINAL (RISKY)</p>
                  <p className="text-sm text-slate-300 line-clamp-5">{originalText}</p>
                </div>
                <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-lg p-3">
                  <p className="text-xs font-semibold text-emerald-400 mb-2">REWRITTEN (SAFE)</p>
                  <p className="text-sm text-slate-200">{rewriteSuggestion}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
