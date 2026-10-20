"use client";

import PrevalenceMap from "@/components/PrevalenceMap";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Overview = {
  regions: number;
  total_dentists: number;
  average_density: number;
  average_screening: number;
  highest_access_gap: string;
};

type Dentist = {
  region: string;
  population: number;
  dentists: number;
  density: number;
};

type Waitlist = {
  region: string;
  treatment: string;
  month: string;
  patients_waiting: number;
};

type Screening = {
  region: string;
  schools: number;
  screened: number;
  coverage: number;
};

type AccessGap = {
  region: string;
  dentist_density: number;
  disease_prevalence: number;
  screening_coverage: number;
  waitlist_pressure: number;
  access_gap_score: number;
};

type Prevalence = {
  region: string;
  age_band: string;
  prevalence: number;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const regions = [
  "All regions",
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
];

const ageBands = ["All age bands", "5-12", "13-18", "19-44", "45+"];

const treatments = [
  "All treatments",
  "Orthodontics",
  "General Dentistry",
  "Pediatric Dentistry",
  "Oral Surgery",
];

export default function Home() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const [screening, setScreening] = useState<Screening[]>([]);
  const [accessGaps, setAccessGaps] = useState<AccessGap[]>([]);
  const [prevalence, setPrevalence] = useState<Prevalence[]>([]);

  const [region, setRegion] = useState("All regions");
  const [ageBand, setAgeBand] = useState("All age bands");
  const [treatment, setTreatment] = useState("All treatments");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          overviewResponse,
          dentistResponse,
          waitlistResponse,
          screeningResponse,
          accessGapResponse,
          prevalenceResponse,
        ] = await Promise.all([
          fetch(`${API}/api/overview`),
          fetch(`${API}/api/dentist-density`),
          fetch(`${API}/api/waitlists`),
          fetch(`${API}/api/screening`),
          fetch(`${API}/api/access-gaps`),
          fetch(`${API}/api/prevalence`),
        ]);

        setOverview(await overviewResponse.json());
        setDentists(await dentistResponse.json());
        setWaitlists(await waitlistResponse.json());
        setScreening(await screeningResponse.json());
        setAccessGaps(await accessGapResponse.json());
        setPrevalence(await prevalenceResponse.json());
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadData();
  }, []);

  const filteredDentists = useMemo(() => {
    if (region === "All regions") {
      return dentists;
    }

    return dentists.filter((item) => item.region === region);
  }, [dentists, region]);

  const filteredScreening = useMemo(() => {
    if (region === "All regions") {
      return screening;
    }

    return screening.filter((item) => item.region === region);
  }, [screening, region]);

  const filteredAccessGaps = useMemo(() => {
    if (region === "All regions") {
      return accessGaps;
    }

    return accessGaps.filter((item) => item.region === region);
  }, [accessGaps, region]);

  const selectedDentistData = useMemo(() => {
    if (region === "All regions") {
      return null;
    }

    return dentists.find((item) => item.region === region) ?? null;
  }, [dentists, region]);

  const selectedScreeningData = useMemo(() => {
    if (region === "All regions") {
      return null;
    }

    return screening.find((item) => item.region === region) ?? null;
  }, [screening, region]);

  const selectedAccessGap = useMemo(() => {
    if (region === "All regions") {
      return null;
    }

    return accessGaps.find((item) => item.region === region) ?? null;
  }, [accessGaps, region]);

  const filteredWaitlists = useMemo(() => {
    let data = waitlists;

    if (region !== "All regions") {
      data = data.filter((item) => item.region === region);
    }

    if (treatment !== "All treatments") {
      data = data.filter((item) => item.treatment === treatment);
    }

    return data;
  }, [waitlists, region, treatment]);

  const waitlistChartData = useMemo(() => {
    const grouped = new Map<string, number>();

    filteredWaitlists.forEach((item) => {
      grouped.set(
        item.month,
        (grouped.get(item.month) ?? 0) + item.patients_waiting
      );
    });

    return Array.from(grouped.entries()).map(([month, patients]) => ({
      month,
      patients,
    }));
  }, [filteredWaitlists]);

  const downloadData = () => {
    const exportData = {
      overview,
      prevalence:
        region === "All regions"
          ? prevalence
          : prevalence.filter((item) => item.region === region),

      dentist_density:
        region === "All regions"
          ? dentists
          : dentists.filter((item) => item.region === region),

      screening:
        region === "All regions"
          ? screening
          : screening.filter((item) => item.region === region),

      access_gaps:
        region === "All regions"
          ? accessGaps
          : accessGaps.filter((item) => item.region === region),

      waitlists: waitlists.filter((item) => {
        const matchesRegion =
          region === "All regions" || item.region === region;

        const matchesTreatment =
          treatment === "All treatments" || item.treatment === treatment;

        return matchesRegion && matchesTreatment;
      }),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "dental-oral-health-data.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#05080d] text-slate-100">
      <header className="border-b border-slate-800 bg-[#080c12] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-slate-100">
              Infocreon Internship - Dental & Oral Health Access Monitor
            </h1>

            <p className="mt-0.5 text-xs text-slate-500">
              Gulf region healthcare access intelligence
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={downloadData}
              className="rounded border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-cyan-400 transition hover:bg-cyan-500/20"
            >
              Download Data
            </button>

            <div className="rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-amber-400">
              Synthetic PoC Data
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] uppercase tracking-wider text-slate-400">100% Connected</span>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex h-7 w-7 items-center justify-center rounded border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-500/20"
                title="Toggle Intelligence Panel"
              >
                i
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`grid min-h-[calc(100vh-89px)] grid-cols-1 ${isSidebarOpen ? "lg:grid-cols-[minmax(0,7fr)_minmax(300px,3fr)]" : "lg:grid-cols-1"}`}>
        <section className="min-w-0 border-r border-slate-800 p-5">
          {/* Dynamic KPI Cards */}
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Kpi
              label={region === "All regions" ? "Total Dentists" : "Dentists"}
              value={
                region === "All regions"
                  ? overview?.total_dentists?.toLocaleString() ?? "--"
                  : selectedDentistData?.dentists?.toLocaleString() ?? "--"
              }
            />

            <Kpi
              label="Dentist Density"
              value={
                region === "All regions"
                  ? overview
                    ? `${overview.average_density}`
                    : "--"
                  : selectedDentistData
                    ? `${selectedDentistData.density}`
                    : "--"
              }
              suffix="per 100k"
            />

            <Kpi
              label="Screening Coverage"
              value={
                region === "All regions"
                  ? overview
                    ? `${overview.average_screening}%`
                    : "--"
                  : selectedScreeningData
                    ? `${selectedScreeningData.coverage}%`
                    : "--"
              }
            />

            <Kpi
              label="Highest Access Gap"
              value={
                region === "All regions"
                  ? overview?.highest_access_gap ?? "--"
                  : selectedAccessGap
                    ? `${selectedAccessGap.access_gap_score}`
                    : "--"
              }
              highlight
            />
          </div>

          {/* Active Regional View Indicator Banner */}
          {region !== "All regions" && (
            <div className="mt-3 flex items-center justify-between rounded-md border border-cyan-500/20 bg-cyan-500/5 px-3 py-2">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-cyan-500">
                  Active regional view
                </p>

                <p className="mt-0.5 text-xs font-medium text-slate-200">
                  {region}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRegion("All regions")}
                className="text-[10px] text-slate-400 transition hover:text-cyan-400"
              >
                Clear
              </button>
            </div>
          )}

          {/* Map Container */}
          <div className="mt-4 min-h-[440px] rounded-xl border border-slate-800 bg-[#080c12] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">
                  Oral Disease Prevalence
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Regional prevalence intelligence by age cohort
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-[9px] uppercase tracking-wider text-slate-500">
                  Intelligence view
                </span>
              </div>
            </div>

            <PrevalenceMap
              data={prevalence}
              ageBand={ageBand}
              selectedRegion={region}
              dentistData={dentists}
            />
          </div>

          {/* Charts Row 1 */}
          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Panel
              title="Dentist Density"
              subtitle="Workforce distribution by region"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={filteredDentists}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="region"
                    tick={{ fill: "#64748b", fontSize: 9 }}
                    tickFormatter={(value) =>
                      value
                        .replace("United Arab Emirates", "UAE")
                        .replace("Saudi Arabia", "Saudi")
                    }
                  />

                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 9 }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0b1118",
                      border: "1px solid #1e293b",
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />

                  <Bar
                    dataKey="density"
                    fill="#22d3ee"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel
              title="Wait-list Trends"
              subtitle="Patients waiting by treatment"
            >
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={waitlistChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748b", fontSize: 9 }}
                  />

                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 9 }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0b1118",
                      border: "1px solid #1e293b",
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="patients"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </div>

          {/* Charts Row 2 */}
          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Panel
              title="School Dental Screening"
              subtitle="Coverage by region"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={filteredScreening}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="region"
                    tick={{ fill: "#64748b", fontSize: 9 }}
                    tickFormatter={(value) =>
                      value
                        .replace("United Arab Emirates", "UAE")
                        .replace("Saudi Arabia", "Saudi")
                    }
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#64748b", fontSize: 9 }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0b1118",
                      border: "1px solid #1e293b",
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />

                  <Bar
                    dataKey="coverage"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel
              title="Access Gap Ranking"
              subtitle="Regions requiring attention"
            >
              <div className="overflow-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-2 py-2">Region</th>
                      <th className="px-2 py-2">Density</th>
                      <th className="px-2 py-2">Screening</th>
                      <th className="px-2 py-2">Gap</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAccessGaps.map((item, index) => (
                      <tr
                        key={item.region}
                        className="border-b border-slate-900"
                      >
                        <td className="px-2 py-2 text-slate-300">
                          <span className="mr-2 text-slate-600">
                            {index + 1}
                          </span>
                          {item.region}
                        </td>

                        <td className="px-2 py-2 text-slate-400">
                          {item.dentist_density}
                        </td>

                        <td className="px-2 py-2 text-slate-400">
                          {item.screening_coverage}%
                        </td>

                        <td className="px-2 py-2 font-semibold text-amber-400">
                          {item.access_gap_score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        </section>

        {/* Sidebar Controls */}
        {isSidebarOpen && (
          <aside className="min-w-0 bg-[#070b11] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
              Intelligence Controls
            </p>

            <h2 className="mt-1 text-sm font-semibold text-slate-200">
              Filters & Context
            </h2>

            <div className="mt-5 space-y-3">
              <Filter
                label="Region"
                value={region}
                options={regions}
                onChange={setRegion}
              />

              <Filter
                label="Age Band"
                value={ageBand}
                options={ageBands}
                onChange={setAgeBand}
              />

              <Filter
                label="Treatment Type"
                value={treatment}
                options={treatments}
                onChange={setTreatment}
              />
            </div>

            <div className="mt-6 rounded-lg border border-slate-800 bg-[#0a0f16] p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Why This Matters
              </h2>

              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                Uneven dental workforce distribution, disease burden, screening
                coverage, and treatment waiting times can create differences in
                access to oral healthcare across regions.
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-slate-800 bg-[#0a0f16] p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Who Controls the Rail
              </h2>

              <div className="mt-3 space-y-2 text-xs text-slate-400">
                <p>FDI World Dental Federation</p>
                <p>World Health Organization</p>
                <p>Saudi Commission for Health Specialties</p>
                <p>UAE MOHAP</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-slate-800 bg-[#0a0f16] p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Regional Snapshot
              </h2>

              {region === "All regions" ? (
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-500">
                      Coverage
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      6 Gulf regions
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] text-slate-500">
                        Dentists
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-200">
                        {overview?.total_dentists?.toLocaleString() ?? "--"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-500">
                        Screening
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-200">
                        {overview?.average_screening ?? "--"}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-500">
                      Highest access gap
                    </p>

                    <p className="mt-1 text-sm font-semibold text-amber-400">
                      {overview?.highest_access_gap ?? "--"}
                    </p>
                  </div>
                </div>
              ) : selectedDentistData &&
                selectedScreeningData &&
                selectedAccessGap ? (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-slate-200">
                    {region}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] text-slate-500">
                        Dentists
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-200">
                        {selectedDentistData.dentists.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-500">
                        Density
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-200">
                        {selectedDentistData.density}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-500">
                        Screening
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-200">
                        {selectedScreeningData.coverage}%
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-500">
                        Access gap
                      </p>

                      <p className="mt-1 text-sm font-semibold text-amber-400">
                        {selectedAccessGap.access_gap_score}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-500">
                  Regional data unavailable.
                </p>
              )}
            </div>

            {selectedAccessGap && (
              <div className="mt-4 rounded-lg border border-amber-500/20 bg-[#0a0f16] p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Key Signal
                  </h2>

                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[9px] uppercase tracking-wider text-amber-400">
                    High Priority
                  </span>
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-200">
                  {selectedAccessGap.region}
                </p>

                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  This region currently shows an elevated access-gap score
                  based on workforce density, screening coverage, disease
                  burden, and wait-list pressure.
                </p>

                <div className="mt-3">
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    Access gap score
                  </p>

                  <p className="mt-1 text-2xl font-semibold text-amber-400">
                    {selectedAccessGap.access_gap_score}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 rounded-lg border border-slate-800 bg-[#0a0f16] p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Data Scope
              </h2>

              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    Geography
                  </p>

                  <p className="mt-1 text-slate-300">
                    Gulf Cooperation Council
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    Coverage
                  </p>

                  <p className="mt-1 text-slate-300">
                    6 regions
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    Dataset
                  </p>

                  <p className="mt-1 text-slate-300">
                    Synthetic PoC dataset
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    Analysis dimensions
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded border border-slate-700 px-2 py-1 text-[9px] text-slate-400">
                      Disease burden
                    </span>

                    <span className="rounded border border-slate-700 px-2 py-1 text-[9px] text-slate-400">
                      Workforce
                    </span>

                    <span className="rounded border border-slate-700 px-2 py-1 text-[9px] text-slate-400">
                      Screening
                    </span>

                    <span className="rounded border border-slate-700 px-2 py-1 text-[9px] text-slate-400">
                      Waiting lists
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {selectedAccessGap && (
              <div className="mt-4 rounded-lg border border-amber-500/20 bg-[#0a0f16] p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Access Gap Signal
                  </h2>

                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[9px] uppercase tracking-wider text-amber-400">
                    Priority
                  </span>
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-200">
                  {selectedAccessGap.region}
                </p>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-500">
                      Access gap score
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-amber-400">
                      {selectedAccessGap.access_gap_score}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-wider text-slate-500">
                      Main pressure
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                      {selectedAccessGap.dentist_density < 55
                        ? "Low dentist density"
                        : selectedAccessGap.screening_coverage < 65
                          ? "Low screening coverage"
                          : "Wait-list pressure"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </main>
  );
}

function Kpi({
  label,
  value,
  suffix,
  highlight = false,
}: {
  label: string;
  value: string;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-[#0a0f16] p-4">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 truncate text-2xl font-semibold ${
          highlight ? "text-amber-400" : "text-slate-100"
        }`}
      >
        {value}
      </p>

      {suffix && (
        <p className="mt-1 text-[10px] text-slate-500">
          {suffix}
        </p>
      )}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-800 bg-[#080c12] p-4">
      <h2 className="text-sm font-semibold text-slate-200">
        {title}
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        {subtitle}
      </p>

      <div className="mt-3">
        {children}
      </div>
    </div>
  );
}

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-md border border-slate-700 bg-[#0b1118] px-3 py-2.5 text-xs text-slate-200 outline-none transition focus:border-cyan-500"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}