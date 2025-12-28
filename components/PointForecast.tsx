import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer } from "lucide-react";

interface ForecastData {
    ts: number[];
    "wind_u-surface": number[];
    "wind_v-surface": number[];
    "temp-surface": number[];
    "past3hprecip-surface": number[];
}

export default function PointForecast() {
    const [forecast, setForecast] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://web-production-69450.up.railway.app";
                const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "RAHASIA_KUNCI_API_ANDA";

                const res = await fetch(`${API_URL}/api/v1/cuaca/point-forecast`, {
                    headers: { "X-API-KEY": API_KEY }
                });

                const data = await res.json();
                // Find the log that contains Windy forecast_raw data
                const forecastLog = Array.isArray(data) ? data.find((d: any) => d.forecast_raw) : data;

                if (forecastLog?.forecast_raw) {
                    setForecast(forecastLog.forecast_raw);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
        const interval = setInterval(fetchForecast, 300000); // 5 mins
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="animate-pulse h-32 bg-slate-800/50 rounded-xl"></div>;
    if (!forecast) return null;

    // Process data for display (next 12-24 hours)
    // Windy data usually comes in 3h intervals
    const timestamps = forecast.ts || [];
    const temps = forecast["temp-surface"] || [];
    const precips = forecast["past3hprecip-surface"] || [];
    const wind_u = forecast["wind_u-surface"] || [];
    const wind_v = forecast["wind_v-surface"] || [];

    // Helper for math degrees
    const toDegrees = (rad: number) => rad * (180 / Math.PI);

    // Helper to get wind speed/dir
    const getWind = (i: number) => {
        const u = wind_u[i] || 0;
        const v = wind_v[i] || 0;
        const speed = Math.sqrt(u * u + v * v);
        const dir = (toDegrees(Math.atan2(u, v)) + 360) % 360;
        return { speed, dir };
    };

    // Slice next 6 intervals (approx 18 hours)
    const items = timestamps.slice(0, 8).map((ts: number, i: number) => {
        const date = new Date(ts);
        const hour = date.getHours();
        const day = date.toLocaleDateString("id-ID", { weekday: "short" });
        const temp = (temps[i] - 273.15).toFixed(0); // Kelvin to Celsius
        const precip = precips[i] || 0;
        const { speed, dir } = getWind(i);

        // Icon logic
        let Icon = Sun;
        let color = "text-yellow-400";
        if (precip > 5) { Icon = CloudRain; color = "text-blue-400"; }
        else if (precip > 0.5) { Icon = CloudRain; color = "text-blue-300"; }
        else if (temps[i] < 273.15 + 20) { Icon = Cloud; color = "text-slate-400"; } // Cloudy/Cool

        return { ts, hour, day, temp, precip, speed, dir, Icon, color };
    });

    return (
        <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <div className="flex min-w-max divide-x divide-slate-800/50">
                {items.map((item: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center px-4 gap-3 min-w-[80px]">
                        {/* Time */}
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">{item.day}</p>
                            <p className="text-sm font-bold text-slate-200">{item.hour}:00</p>
                        </div>

                        {/* Icon */}
                        <div className={`${item.color} drop-shadow-lg`}>
                            <item.Icon size={28} strokeWidth={2.5} />
                        </div>

                        {/* Temp */}
                        <div className="text-lg font-black text-white tracking-tight">
                            {item.temp}°
                        </div>

                        {/* Wind */}
                        <div className="flex flex-col items-center gap-1">
                            <div
                                style={{ transform: `rotate(${item.dir}deg)` }}
                                className="transition-transform duration-500"
                            >
                                <Wind size={14} className="text-slate-500" />
                            </div>
                            <p className="text-[10px] font-mono text-slate-400">{item.speed.toFixed(1)} m/s</p>
                        </div>

                        {/* Precip */}
                        <div className="h-8 flex items-end justify-center w-full">
                            {item.precip > 0 ? (
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-full bg-blue-500/30 rounded-t-sm"
                                        style={{ height: `${Math.min(item.precip * 5, 32)}px`, width: '12px' }}
                                    ></div>
                                    <p className="text-[9px] font-bold text-blue-300 mt-1">{item.precip.toFixed(1)}</p>
                                </div>
                            ) : (
                                <span className="text-[9px] text-slate-700">-</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
