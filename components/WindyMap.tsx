"use client";

export default function WindyMap() {
  // Koordinat tengah Aceh (Banda Aceh sekitarnya)
  const lat = 4.6951;
  const lon = 96.7494;

  return (
    <div className="w-full h-[400px] xl:h-[500px] rounded-[2rem] overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src={`https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=7&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`}
        frameBorder="0"
        className="w-full h-full"
      ></iframe>
    </div>
  );
}