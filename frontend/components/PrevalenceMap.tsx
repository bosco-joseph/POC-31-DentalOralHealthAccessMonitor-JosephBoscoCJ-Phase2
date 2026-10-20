"use client";

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

type Prevalence = {
  region: string;
  age_band: string;
  prevalence: number;
};

type Dentist = {
  region: string;
  population: number;
  dentists: number;
  density: number;
};

type Props = {
  data: Prevalence[];
  dentistData: Dentist[];
  ageBand: string;
  selectedRegion: string;
};

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const GULF_REGIONS = [
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
];

const colorScale = scaleLinear<string>()
  .domain([35, 45, 55, 65, 70])
  .range([
    "#082f49",
    "#0e7490",
    "#0891b2",
    "#22d3ee",
    "#67e8f9",
  ]);

export default function PrevalenceMap({
  data,
  dentistData,
  ageBand,
  selectedRegion,
}: Props) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const prevalenceByRegion = useMemo(() => {
    const result: Record<string, number> = {};

    GULF_REGIONS.forEach((region) => {
      const regionData =
        ageBand === "All age bands"
          ? data.filter((item) => item.region === region)
          : data.filter(
              (item) =>
                item.region === region &&
                item.age_band === ageBand
            );

      if (regionData.length > 0) {
        result[region] = Math.round(
          regionData.reduce(
            (sum, item) => sum + item.prevalence,
            0
          ) / regionData.length
        );
      }
    });

    return result;
  }, [data, ageBand]);

  const dentistByRegion = useMemo(() => {
    return dentistData.reduce<Record<string, Dentist>>(
      (result, item) => {
        result[item.region] = item;
        return result;
      },
      {}
    );
  }, [dentistData]);

  const hoveredPrevalence =
    hoveredRegion
      ? prevalenceByRegion[hoveredRegion]
      : undefined;

  const hoveredDentist =
    hoveredRegion
      ? dentistByRegion[hoveredRegion]
      : undefined;

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-lg bg-[#060b11]">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [50, 25],
          scale: 1050,
        }}
        width={800}
        height={360}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;

              const value =
                prevalenceByRegion[countryName];

              const isGulfRegion =
                GULF_REGIONS.includes(countryName);

              const isSelected =
                selectedRegion === countryName;

              return (
                <Geography
                  key={geo.properties.name || geo.id}
                  geography={geo}
                  fill={
                    isGulfRegion && value !== undefined
                      ? colorScale(value)
                      : "#111827"
                  }
                  stroke={
                    isSelected
                      ? "#67e8f9"
                      : hoveredRegion === countryName
                        ? "#38bdf8"
                        : "#334155"
                  }
                  strokeWidth={
                    isSelected
                      ? 2
                      : hoveredRegion === countryName
                        ? 1.5
                        : 0.6
                  }
                  onMouseEnter={() => {
                    if (isGulfRegion) {
                      setHoveredRegion(countryName);
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredRegion(null);
                  }}
                  style={{
                    default: {
                      outline: "none",
                    },
                    hover: {
                      fill: isGulfRegion
                        ? "#67e8f9"
                        : "#111827",
                      outline: "none",
                      cursor: isGulfRegion
                        ? "pointer"
                        : "default",
                    },
                    pressed: {
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Map title */}
      <div className="absolute left-3 top-3 rounded-md border border-slate-700 bg-[#080c12]/95 px-3 py-2">
        <p className="text-[9px] uppercase tracking-wider text-slate-500">
          Oral disease prevalence
        </p>

        <p className="mt-1 text-xs text-slate-300">
          Age band: {ageBand}
        </p>
      </div>

      {/* Hover intelligence */}
      {hoveredRegion &&
        hoveredPrevalence !== undefined && (
          <div className="absolute right-3 top-3 w-52 rounded-lg border border-cyan-500/30 bg-[#080c12]/95 p-3 shadow-xl">
            <p className="text-[9px] uppercase tracking-wider text-cyan-400">
              Regional intelligence
            </p>

            <h3 className="mt-1 text-sm font-semibold text-slate-100">
              {hoveredRegion}
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <p className="text-[9px] text-slate-500">
                  Prevalence
                </p>

                <p className="text-sm font-semibold text-slate-200">
                  {hoveredPrevalence}%
                </p>
              </div>

              <div>
                <p className="text-[9px] text-slate-500">
                  Dentist density
                </p>

                <p className="text-sm font-semibold text-slate-200">
                  {hoveredDentist
                    ? hoveredDentist.density
                    : "--"}
                </p>
              </div>
            </div>

            <p className="mt-2 text-[9px] text-slate-600">
              Dentists per 100,000 population
            </p>
          </div>
        )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 rounded-md border border-slate-700 bg-[#080c12]/95 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-500">
            Low
          </span>

          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-cyan-950 to-cyan-400" />

          <span className="text-[9px] text-slate-500">
            High
          </span>
        </div>
      </div>

      {/* Selected region */}
      {selectedRegion !== "All regions" &&
        prevalenceByRegion[selectedRegion] !== undefined && (
          <div className="absolute bottom-3 right-3 rounded-md border border-cyan-500/30 bg-[#080c12]/95 px-3 py-2 text-right">
            <p className="text-[9px] uppercase tracking-wider text-slate-500">
              Selected region
            </p>

            <p className="mt-1 text-xs font-semibold text-cyan-400">
              {selectedRegion}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-100">
              {prevalenceByRegion[selectedRegion]}%
            </p>
          </div>
        )}
    </div>
  );
}