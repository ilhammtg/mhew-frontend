import { Wifi, MapPin } from "lucide-react";

interface Device {
    id: string;
    name: string;
    status: string;
    lastPing: string;
    location: string;
    bat: string;
}

interface IoTListProps {
    devices: Device[];
}

export default function IoTList({ devices }: IoTListProps) {
    return (
        <div className="bg-slate-900/80 rounded-[2rem] border border-white/10 p-6 shadow-xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Wifi size={14} /> EWS Network
                </h3>
                <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
                    {devices.length} Units
                </span>
            </div>

            <div className="space-y-3">
                {devices.map((d) => (
                    <div key={d.id} className="bg-slate-950/50 p-4 rounded-xl border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800 group-hover:bg-blue-500 transition-colors"></div>
                        <div className="flex justify-between items-start mb-2 pl-2">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${d.status === "Online" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" : "bg-red-500"}`}></span>
                                <span className="text-[10px] font-mono text-slate-500 group-hover:text-blue-400 transition-colors">{d.id}</span>
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${d.status === "Online" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                                {d.status}
                            </span>
                        </div>
                        <p className="text-sm font-bold text-slate-200 mb-2 pl-2 leading-tight">{d.name}</p>
                        <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-2 pl-2">
                            <span className="text-[9px] text-slate-500 uppercase flex items-center gap-1"><MapPin size={8} /> {d.location}</span>
                            <span className={`text-[9px] font-bold font-mono ${d.bat === "0%" ? "text-red-500" : "text-emerald-400"}`}>
                                {d.bat} BAT
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
