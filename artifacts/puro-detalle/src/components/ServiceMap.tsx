import React from 'react';
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Base: Pozuelo de Alarcón
const HOME: [number, number] = [40.4359, -3.8143];
const RADIUS_KM = 20;

// Zonas sin coste de transporte
const FREE_ZONES: { name: string; pos: [number, number] }[] = [
  { name: 'Pozuelo de Alarcón', pos: HOME },
  { name: 'Boadilla del Monte', pos: [40.4052, -3.8764] },
  { name: 'Majadahonda', pos: [40.4729, -3.8722] },
  { name: 'Las Rozas', pos: [40.4919, -3.8735] },
  { name: 'Aravaca', pos: [40.4571, -3.7791] },
];

export default function ServiceMap() {
  return (
    <div className="w-full">
      <div className="rounded-2xl overflow-hidden border border-[#0077D6]/30 shadow-[0_10px_40px_rgba(0,119,214,0.14)]">
        <MapContainer
          center={HOME}
          zoom={11}
          scrollWheelZoom={false}
          style={{ height: '420px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* Radio de 20 km: zona con suplemento de transporte */}
          <Circle
            center={HOME}
            radius={RADIUS_KM * 1000}
            pathOptions={{
              color: '#5B6470',
              weight: 2,
              dashArray: '6 8',
              fillColor: '#8C96A3',
              fillOpacity: 0.06,
            }}
          />

          {/* Zonas con transporte incluido: manchas azules del color de la marca */}
          {FREE_ZONES.map((z) => (
            <Circle
              key={z.name}
              center={z.pos}
              radius={2300}
              pathOptions={{
                color: '#0077D6',
                weight: 1.5,
                fillColor: '#37B6FF',
                fillOpacity: 0.4,
              }}
            >
              <Tooltip permanent direction="center" className="pd-map-label">
                {z.name}
              </Tooltip>
            </Circle>
          ))}
        </MapContainer>
      </div>

      {/* Leyenda */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 font-sans text-sm md:text-base text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#37B6FF]/60 border-2 border-[#0077D6] shrink-0" />
          Transporte incluido
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-dashed border-[#5B6470] bg-[#8C96A3]/20 shrink-0" />
          Hasta {RADIUS_KM} km: pequeño suplemento por transporte
        </span>
      </div>
    </div>
  );
}
