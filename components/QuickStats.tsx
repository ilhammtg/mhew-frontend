import { Activity, Database, CloudRain } from "lucide-react";
import { useEffect, useState } from "react";

interface QuickStatsProps {
    devices: any[];
    history: any[];
}

export default function QuickStats({ devices, history }: QuickStatsProps) {
    const [precipData, setPrecipData] = useState<any[]>([]);

    useEffect(() => {
        const fetchPrecip = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/v1/cuaca/precip");
                const data = await res.json();
                setPrecipData(data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchPrecip();
        const interval = setInterval(fetchPrecip, 60000);
        return () => clearInterval(interval);
    }, []);

    const maxRisk = precipData.reduce((acc, curr) => {
        if (curr.status === "DANGER") return "DANGER";
        if (curr.status === "WARNING" && acc !== "DANGER") return "WARNING";
        return acc;
    }, "SAFE");

    const maxPrecip = Math.max(...precipData.map(d => d.total_precip_24h), 0);

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-blue-500/30 transition-colors group">
                <div className="flex items-center gap-3 mb-3 text-blue-400">
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        <Activity size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider">Sensor</span>
                </div>
                <p className="text-3xl font-black text-white">{devices.filter(d => d.status === 'Online').length}<span className="text-slate-600 text-lg">/{devices.length}</span></p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Unit Aktif</p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-yellow-500/30 transition-colors group">
                <div className="flex items-center gap-3 mb-3 text-yellow-400">
                    <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                        <Database size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider">Database</span>
                </div>
                <p className="text-3xl font-black text-white">{history.length}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Event Terekam</p>
            </div>

            {/* Flood Risk Card */}
            <div className={`col-span-2 p-5 rounded-2xl border backdrop-blur-sm transition-colors group ${maxRisk === "DANGER" ? "bg-red-900/40 border-red-500/50 hover:border-red-500" :
                    maxRisk === "WARNING" ? "bg-orange-900/40 border-orange-500/50 hover:border-orange-500" :
                        "bg-slate-900/60 border-white/5 hover:border-blue-500/30"
                }`}>
                <div className={`flex items-center gap-3 mb-3 ${maxRisk === "DANGER" ? "text-red-400" :
                        maxRisk === "WARNING" ? "text-orange-400" :
                            "text-blue-400"
                    }`}>
                    <div className={`p-2 rounded-lg transition-colors ${maxRisk === "DANGER" ? "bg-red-500/10 group-hover:bg-red-500/20" :
                            maxRisk === "WARNING" ? "bg-orange-500/10 group-hover:bg-orange-500/20" :
                                "bg-blue-500/10 group-hover:bg-blue-500/20"
                        }`}>
                        <CloudRain size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider">Status Banjir</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-3xl font-black text-white">{maxPrecip.toFixed(1)}<span className="text-slate-600 text-lg">mm</span></p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Curah Hujan 24J</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase ${maxRisk === "DANGER" ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse" :
                            maxRisk === "WARNING" ? "bg-orange-500/20 border-orange-500/50 text-orange-400" :
                                "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        }`}>
                        {maxRisk === "DANGER" ? "BAHAYA" : maxRisk === "WARNING" ? "WASPADA" : "AMAN"}
                    </div>
                </div>
            </div>
        </div>
    );
}
