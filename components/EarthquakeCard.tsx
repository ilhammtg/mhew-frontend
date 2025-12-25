import { Wifi, AlertTriangle, Activity, MapPin, Copy, Wind } from "lucide-react";

interface EarthquakeCardProps {
    gempa: any;
}

export default function EarthquakeCard({ gempa }: EarthquakeCardProps) {
    const getAlertConfig = (potensi: string) => {
        const p = potensi?.toLowerCase() || "";
        if (p.includes("tsunami") || p.includes("awas")) return {
            color: "red",
            label: "POTENSI TSUNAMI",
            bg: "bg-red-500",
            text: "text-red-500",
            border: "border-red-500/50",
            shadow: "shadow-red-500/20",
            gradient: "from-red-900/80 to-slate-900"
        };
        if (p.includes("waspada") || p.includes("siaga")) return {
            color: "orange",
            label: "WASPADA TSUNAMI",
            bg: "bg-orange-500",
            text: "text-orange-500",
            border: "border-orange-500/50",
            shadow: "shadow-orange-500/20",
            gradient: "from-orange-900/80 to-slate-900"
        };
        return {
            color: "emerald",
            label: "AMAN (NORMAL)",
            bg: "bg-emerald-500",
            text: "text-emerald-500",
            border: "border-emerald-500/50",
            shadow: "shadow-emerald-500/20",
            gradient: "from-emerald-900/20 to-slate-900"
        };
    };

    const alert = getAlertConfig(gempa?.Potensi);
    const coordinates = gempa?.Coordinates || "-";

    return (
        <div className={`relative overflow-hidden rounded-[2rem] bg-slate-900 border ${alert.border} shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] group`}>
            {/* Dynamic Background */}
            <div className={`absolute inset-0 bg-gradient-to-b ${alert.gradient} opacity-20`}></div>

            <div className="relative p-8 z-10 flex flex-col h-full justify-between min-h-[500px]">
                <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
                            <Wifi size={14} className={`${alert.text} animate-pulse`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${alert.text}`}>Live Sensor Feed</span>
                        </div>
                        {alert.label.includes("TSUNAMI") && (
                            <div className="animate-bounce bg-red-500/20 p-2 rounded-full border border-red-500/50">
                                <AlertTriangle size={24} className="text-red-500" />
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Activity size={16} className="text-slate-500" /> Magnitudo
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-8xl font-black text-white tracking-tighter tabular-nums leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                {gempa?.Magnitude}
                            </h2>
                            <span className="text-2xl font-bold text-slate-500">SR</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    {/* Location Card */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${alert.bg} bg-opacity-20 text-white shrink-0 shadow-lg`}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight mb-2">{gempa?.Wilayah}</h3>
                                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                                    <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">{gempa?.Tanggal}</span>
                                    <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">{gempa?.Jam}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-slate-500 font-bold uppercase block mb-1 text-[10px] tracking-wider">Kedalaman</span>
                            <span className="text-2xl font-black text-white">{gempa?.Kedalaman}</span>
                        </div>
                        <div
                            className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer group/coord relative overflow-hidden"
                            onClick={() => navigator.clipboard.writeText(coordinates)}
                        >
                            <span className="text-slate-500 font-bold uppercase block mb-1 text-[10px] tracking-wider flex justify-between items-center">
                                Koordinat <Copy size={12} className="opacity-0 group-hover/coord:opacity-100 transition-opacity text-blue-400" />
                            </span>
                            <span className="text-white font-mono text-sm truncate block" title={coordinates}>{coordinates}</span>
                        </div>
                    </div>

                    {/* MMI Info */}
                    {gempa?.Dirasakan && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest block mb-1 flex items-center gap-2">
                                <Wind size={12} /> Dampak Dirasakan (MMI)
                            </span>
                            <p className="text-xs text-emerald-100 leading-relaxed font-medium">{gempa.Dirasakan}</p>
                        </div>
                    )}

                    {/* Status Banner */}
                    <div className={`py-4 text-center rounded-xl font-black uppercase tracking-[0.2em] text-sm ${alert.bg} text-white shadow-lg shadow-${alert.color}-500/20 border border-white/20`}>
                        {alert.label}
                    </div>
                </div>
            </div>
        </div>
    );
}
