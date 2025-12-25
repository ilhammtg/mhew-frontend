import { Droplets, Calendar } from "lucide-react";
import PointForecast from "./PointForecast";

interface WeatherWidgetProps {
    cuaca: any[];
}

export default function WeatherWidget({ cuaca }: WeatherWidgetProps) {
    return (
        <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 rounded-[2rem] border border-white/10 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] group-hover:bg-blue-500/30 transition-colors"></div>
            <div className="absolute top-6 right-6 opacity-20"><Droplets size={48} className="text-white" /></div>

            <h3 className="text-xs font-black text-blue-200 uppercase tracking-widest mb-6 relative z-10">Point Forecast</h3>

            <div className="relative z-10">
                <PointForecast />
            </div>
        </div>
    );
}
