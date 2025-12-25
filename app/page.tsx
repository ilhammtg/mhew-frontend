"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import Header from "../components/Header";
import EarthquakeCard from "../components/EarthquakeCard";
import QuickStats from "../components/QuickStats";
import WeatherCard from "../components/WeatherCard";
import ShakemapCard from "../components/ShakemapCard";
import IoTList from "../components/IoTList";
import WeatherWidget from "../components/WeatherWidget";
import HistoryList from "../components/HistoryList";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Dashboard() {
  const [gempa, setGempa] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [cuaca, setCuaca] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [devices] = useState([
    { id: "TOA-01", name: "Masjid Raya Baiturrahman", status: "Online", lastPing: "1m lalu", location: "Banda Aceh", bat: "98%" },
    { id: "TOA-02", name: "Masjid Agung Meulaboh", status: "Online", lastPing: "3m lalu", location: "Aceh Barat", bat: "85%" },
    { id: "TOA-03", name: "Pesisir Lhokseumawe", status: "Offline", lastPing: "2j lalu", location: "Lhokseumawe", bat: "0%" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resGempa, resHistory, resCuaca] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/v1/gempa/terkini"),
          fetch("http://127.0.0.1:8000/api/v1/gempa/aceh"),
          fetch("http://127.0.0.1:8000/api/v1/cuaca/aceh")
        ]);

        setGempa(await resGempa.json());
        setHistory(await resHistory.json());
        setCuaca(await resCuaca.json());
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        <p className="tracking-[0.3em] uppercase text-xs font-bold text-blue-400 animate-pulse">Initializing System...</p>
      </div>
    </div>
  );

  const [lat, lon] = gempa?.Coordinates?.split(",").map(Number) || [5.5, 95.3];
  const shakemap = gempa?.Shakemap ? `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}` : null;

  return (
    <main className="min-h-screen bg-[#050505] text-slate-300 p-4 md:p-6 font-sans selection:bg-blue-500/30 selection:text-blue-200 relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,_#1e293b_0%,_transparent_100%)] pointer-events-none opacity-40"></div>

      <div className="max-w-[1920px] mx-auto relative z-10">
        <Header currentTime={currentTime} />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* --- LEFT COLUMN: MAIN ALERT (4 cols) --- */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <EarthquakeCard gempa={gempa} />
            <QuickStats devices={devices} history={history} />
          </div>

          {/* --- MIDDLE COLUMN: MAP & SHAKEMAP (5 cols) --- */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            {/* MAIN MAP CONTAINER */}
            <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-[2.5rem] shadow-2xl relative group">
              <div className="absolute inset-0 bg-blue-500/5 rounded-[2.5rem] blur-xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>
              <div className="relative h-[450px] xl:h-[550px] w-full rounded-[2rem] overflow-hidden bg-slate-950 border border-slate-800">
                <div className="absolute top-6 left-6 z-[400] bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 text-xs font-bold text-white flex gap-3 items-center shadow-lg">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  <span>LIVE TRACKING</span>
                </div>
                <Map lat={lat} lon={lon} wilayah={gempa?.Wilayah} />
              </div>
            </div>

            <WeatherCard />
            <ShakemapCard shakemap={shakemap} />
          </div>

          {/* --- RIGHT COLUMN: INFO & WEATHER (3 cols) --- */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            <IoTList devices={devices} />
            <WeatherWidget cuaca={cuaca} />
            <HistoryList history={history} />
          </div>
        </div>

        <div className="mt-12 text-center border-t border-white/5 pt-8 pb-8">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] hover:text-slate-500 transition-colors cursor-default">
            MHEWS Aceh Command Center • v2.0-Alpha • Integrated System
          </p>
        </div>
      </div>
    </main>
  );
}