import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, MapPin } from "lucide-react";

interface WeatherData {
    current: {
        temp: number;
        desc: string;
        humidity: number;
        wind_speed: number;
        precip: number;
    };
    forecast: any[];
    location: string;
    distance?: number;
}

export default function PointForecast() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [userLoc, setUserLoc] = useState<{ lat: number; lon: number } | null>(null);

    // 1. Get User Location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                (err) => console.log("Loc error:", err)
            );
        }
    }, []);

    // 2. Fetch & Find Nearest
    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://web-production-69450.up.railway.app";
                const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "RAHASIA_KUNCI_API_ANDA";

                const res = await fetch(`${API_URL}/api/v1/cuaca/point-forecast`, {
                    headers: { "X-API-KEY": API_KEY }
                });
                const data = await res.json();

                if (!Array.isArray(data) || data.length === 0) return;

                let selected = data[0]; // Default

                // Find nearest if userLoc available
                if (userLoc) {
                    let min = 99999;
                    data.forEach((d: any) => {
                        if (d.coords && d.coords.lat) {
                            const dist = Math.sqrt(
                                Math.pow(d.coords.lat - userLoc.lat, 2) +
                                Math.pow(d.coords.lon - userLoc.lon, 2)
                            );
                            if (dist < min) {
                                min = dist;
                                selected = d;
                            }
                        }
                    });
                }

                // Map Response to State
                setWeather({
                    current: {
                        temp: selected.data.temp,
                        desc: selected.data.weather_desc,
                        humidity: selected.data.humidity,
                        wind_speed: selected.data.wind_speed,
                        precip: selected.data.precip_mm
                    },
                    forecast: selected.forecast_3h || [],
                    location: selected.location_name
                });

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, [userLoc]);

    if (loading) return <div className="animate-pulse h-64 bg-slate-900/50 rounded-3xl border border-white/5"></div>;
    if (!weather) return null;

    // Helper for Icon
    const getIcon = (desc: string) => {
        const d = desc.toLowerCase();
        if (d.includes("hujan")) return { Icon: CloudRain, color: "text-blue-400" };
        if (d.includes("berawan")) return { Icon: Cloud, color: "text-slate-300" };
        if (d.includes("cerah")) return { Icon: Sun, color: "text-yellow-400" };
        return { Icon: Cloud, color: "text-slate-400" };
    };

    const MainIcon = getIcon(weather.current.desc).Icon;

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* CURRENT WEATHER CARD */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-slate-900/80 border border-blue-500/20 rounded-[2.5rem] p-8 shadow-2xl group">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold">
                            <MapPin size={12} />
                            {weather.location}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SAAT INI</p>
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                        <div className={`p-4 rounded-3xl bg-gradient-to-br from-blue-500/20 to-transparent border border-white/10 shadow-lg ${getIcon(weather.current.desc).color}`}>
                            <MainIcon size={64} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-6xl font-black text-white tracking-tighter shadow-black drop-shadow-lg">
                                {Math.round(weather.current.temp)}°
                            </h2>
                            <p className="text-lg font-medium text-blue-200">{weather.current.desc}</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <Droplets size={16} className="text-blue-400 mb-1" />
                            <span className="text-sm font-bold text-slate-200">{weather.current.humidity}%</span>
                            <span className="text-[9px] text-slate-500 uppercase">Lembab</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <Wind size={16} className="text-emerald-400 mb-1" />
                            <span className="text-sm font-bold text-slate-200">{weather.current.wind_speed} <span className="text-[10px]">m/s</span></span>
                            <span className="text-[9px] text-slate-500 uppercase">Angin</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <Eye size={16} className="text-purple-400 mb-1" />
                            <span className="text-sm font-bold text-slate-200">&gt; 10 <span className="text-[10px]">km</span></span>
                            <span className="text-[9px] text-slate-500 uppercase">Visib.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FORECAST LIST */}
            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Prakiraan 24 Jam</h3>
                <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    <div className="flex gap-4 min-w-max px-2">
                        {weather.forecast.map((item: any, idx: number) => {
                            const { Icon, color } = getIcon(item.desc);
                            return (
                                <div key={idx} className="flex flex-col items-center p-4 rounded-[2rem] bg-slate-900/40 border border-white/5 min-w-[100px] hover:bg-slate-800/60 transition-colors">
                                    <span className="text-xs font-bold text-slate-500 mb-2">{item.time}</span>
                                    <div className={`mb-3 ${color}`}>
                                        <Icon size={32} strokeWidth={2} />
                                    </div>
                                    <span className="text-xl font-black text-white mb-1">{item.temp}°</span>
                                    <span className="text-[10px] font-medium text-slate-400 text-center line-clamp-2 w-full">{item.desc}</span>

                                    {/* Mini Stats for Forecast */}
                                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5 w-full justify-center">
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <Droplets size={10} />
                                            <span className="text-[9px]">{item.humidity || '-'}%</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <Wind size={10} />
                                            <span className="text-[9px]">{item.wind_speed || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
