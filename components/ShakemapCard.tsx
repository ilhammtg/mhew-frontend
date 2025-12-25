import { Layers } from "lucide-react";

interface ShakemapCardProps {
    shakemap: string | null;
}

export default function ShakemapCard({ shakemap }: ShakemapCardProps) {
    if (!shakemap) return null;

    return (
        <div className="bg-slate-900/50 rounded-3xl border border-white/5 p-1 shadow-xl backdrop-blur-sm">
            <div className="bg-slate-950 rounded-[1.3rem] overflow-hidden relative group">
                <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10">
                    <h3 className="font-bold text-[10px] text-white uppercase flex items-center gap-2">
                        <Layers size={12} className="text-blue-400" /> Shakemap
                    </h3>
                </div>
                <img src={shakemap} alt="Shakemap" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            </div>
        </div>
    );
}
