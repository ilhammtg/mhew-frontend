import { Activity } from "lucide-react";

interface HistoryListProps {
    history: any[];
}

export default function HistoryList({ history }: HistoryListProps) {
    return (
        <div className="flex-1 bg-slate-900/80 rounded-[2rem] border border-white/10 p-6 shadow-xl min-h-[300px] backdrop-blur-md">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity size={14} /> Recent Events
            </h3>
            <div className="space-y-0 relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-800"></div>
                {history.slice(0, 5).map((h, i) => (
                    <div key={i} className="relative pl-10 py-3 group cursor-default">
                        <div className="absolute left-[11px] top-5 w-2 h-2 bg-slate-900 border border-slate-600 rounded-full z-10 group-hover:border-blue-500 group-hover:bg-blue-500 transition-all shadow-[0_0_0_4px_rgba(15,23,42,1)]"></div>
                        <div className="flex justify-between items-start p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                            <div>
                                <span className="text-[10px] font-bold text-slate-500 block mb-0.5 font-mono">{h.Jam}</span>
                                <span className="text-xs font-bold text-slate-300 leading-tight block group-hover:text-white transition-colors">{h.Wilayah}</span>
                            </div>
                            <span className="text-xs font-black text-orange-400 bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/20">{h.Magnitude}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
