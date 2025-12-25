import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Droplets, Wind, AlertTriangle } from "lucide-react";

const WindyMap = dynamic(() => import("./WindyMap"), { ssr: false });

export default function WeatherCard() {
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

    let cardStyle = "bg-slate-900 border-slate-800";
    let iconColor = "bg-blue-600";
    let titleColor = "text-white";

    if (maxRisk === "DANGER") {
        cardStyle = "bg-red-900/40 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)]";
        iconColor = "bg-red-600 animate-pulse";
        titleColor = "text-red-100";
    } else if (maxRisk === "WARNING") {
        cardStyle = "bg-orange-900/40 border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.3)]";
        iconColor = "bg-orange-600";
        titleColor = "text-orange-100";
    }

    return (
        <div className={`${cardStyle} rounded-[2.5rem] border shadow-xl overflow-hidden relative transition-all duration-500`}>
            <div className="p-8 pb-0 relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3.5 ${iconColor} text-white rounded-2xl shadow-lg shadow-blue-600/20`}>
                            {maxRisk === "DANGER" ? <AlertTriangle size={24} /> : <Droplets size={24} />}
                        </div>
                        <div>
                            <h3 className={`font-black text-xl ${titleColor} tracking-tight`}>
                                {maxRisk === "DANGER" ? "BAHAYA BANJIR BANDANG" : (maxRisk === "WARNING" ? "WASPADA BANJIR" : "Weather Radar")}
                            </h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                {maxRisk !== "SAFE" ?
                                    <span className="text-white font-mono">Akumulasi Hujan: {maxPrecip.toFixed(1)} mm</span>
                                    :
                                    <>Live Data <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Windy.com</>
                                }
                            </p>
                        </div>
                    </div>
                    <div className="bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                        <span className="text-[10px] font-bold text-blue-400 uppercase">Aceh Region</span>
                    </div>
                </div>
            </div>

            <div className="px-2">
                <WindyMap />
            </div>

            <div className="p-6 bg-slate-900 border-t border-slate-800">
                <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-500">
                        <Wind size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-wide">Analisis Angin</p>
                        <p className="text-sm font-medium text-slate-400 leading-tight">Monitoring kecepatan angin real-time di pesisir.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
