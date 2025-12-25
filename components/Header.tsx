import { ShieldCheck, Clock, Calendar } from "lucide-react";

interface HeaderProps {
    currentTime: Date;
}

export default function Header({ currentTime }: HeaderProps) {
    return (
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-slate-900/40 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 rounded-full"></div>
                    <div className="relative p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg border border-blue-400/20 text-white">
                        <ShieldCheck size={28} />
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight leading-none">MHEWS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">ACEH</span></h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="h-px w-8 bg-blue-500/50"></span>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-blue-400/80 font-bold">Command Center</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="hidden lg:flex flex-col items-end border-r border-white/10 pr-8">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">System Status</span>
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-bold text-emerald-400 tracking-wide">OPERATIONAL</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-white mb-1">
                        <Clock size={16} className="text-blue-400" />
                        <p className="text-2xl font-bold tabular-nums tracking-tight">
                            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                        <Calendar size={12} />
                        <p className="text-[11px] font-medium uppercase tracking-wide">
                            {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
