// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";
import {
  LayoutDashboard,
  PlusCircle,
  Edit3,
  Search,
  ChevronRight
} from "lucide-react";

/* ================= CONFIG ================= */

const kingdomColors = {
  Animalia: "#3B82F6",
  Plantae: "#10B981",
  Fungi: "#F59E0B",
  Bacteria: "#8B5CF6",
  Undecided: "#9CA3AF"
};

const STORAGE_KEY = "merobase_samples";

/* ================= COMPONENT ================= */

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [samples, setSamples] = useState([]);

  /* ================= LOAD FROM LOCALSTORAGE ================= */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setSamples(raw ? JSON.parse(raw) : []);
    } catch {
      setSamples([]);
    }
  }, []);

  /* ================= KPI ================= */

  const totalSamples = samples.length;
  const totalProjects = new Set(
    samples.map(s => s.metadata?.projectType).filter(Boolean)
  ).size;
  const totalKingdoms = new Set(
    samples.map(s => s.metadata?.kingdom).filter(Boolean)
  ).size;
  const totalSpecies = new Set(
    samples.map(s => s.metadata?.species).filter(Boolean)
  ).size;

  const kpiData = [
    { label: "Total Samples", value: totalSamples, color: "bg-blue-600" },
    { label: "Total Projects", value: totalProjects, color: "bg-green-600" },
    { label: "Total Kingdoms", value: totalKingdoms, color: "bg-yellow-500" },
    { label: "Total Species", value: totalSpecies, color: "bg-purple-600" }
  ];

  /* ================= LATEST ================= */

  const latestRegistered = samples.at(-1);
  const latestEdited = [...samples]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))[0];

  /* ================= CHART DATA ================= */

  const kingdomCounts = Object.entries(
    samples.reduce((acc, s) => {
      const k = s.metadata?.kingdom || "Undecided";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const projectCounts = Object.entries(
    samples.reduce((acc, s) => {
      const p = s.metadata?.projectType || "Unknown";
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const dateCounts = Object.entries(
    samples.reduce((acc, s) => {
      const d = s.metadata?.collectionDate || "Unknown";
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {})
  ).map(([date, value]) => ({ date, value }));

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`bg-white shadow-xl transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-16"} h-screen flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-700">MEROBase</h1>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <ChevronRight
              className={`transition-transform ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <nav className="flex flex-col mt-4">
          <SidebarBtn
            icon={<LayoutDashboard className="text-blue-600" />}
            label="Dashboard"
            open={sidebarOpen}
            onClick={() => navigate("/dashboard")}
          />
          <SidebarBtn
            icon={<PlusCircle className="text-green-600" />}
            label="Add Sample"
            open={sidebarOpen}
            onClick={() => navigate("/add/step1")}
          />
          <SidebarBtn
            icon={<Edit3 className="text-yellow-600" />}
            label="Edit Sample"
            open={sidebarOpen}
            onClick={() => navigate("/editsample")}
          />
          <SidebarBtn
            icon={<Search className="text-purple-600" />}
            label="Search Sample"
            open={sidebarOpen}
            onClick={() => navigate("/searchsample")}
          />
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
            >
              <span
                className={`inline-block text-white text-sm px-2 py-1 rounded ${kpi.color}`}
              >
                {kpi.label}
              </span>
              <h2 className="text-3xl font-bold mt-2">{kpi.value}</h2>
            </div>
          ))}
        </div>

        {/* Latest */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InfoCard title="Latest Registered" sample={latestRegistered} />
          <InfoCard title="Latest Edited" sample={latestEdited} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ChartBox title="Kingdom Types">
            <PieChart width={260} height={260}>
              <Pie data={kingdomCounts} dataKey="value" label>
                {kingdomCounts.map((e, i) => (
                  <Cell key={i} fill={kingdomColors[e.name] || "#D1D5DB"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartBox>

          <ChartBox title="Project Types">
            <BarChart width={260} height={260} data={projectCounts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ChartBox>

          <ChartBox title="Date Acquired">
            <LineChart width={260} height={260} data={dateCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#10B981" />
            </LineChart>
          </ChartBox>
        </div>
      </main>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function SidebarBtn({ icon, label, open, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg"
    >
      {icon}
      {open && <span>{label}</span>}
    </button>
  );
}

function InfoCard({ title, sample }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {sample ? (
        <>
          <p className="font-medium">{sample.metadata?.species}</p>
          <p className="text-sm text-gray-500">
            Kingdom: {sample.metadata?.kingdom}
          </p>
          <p className="text-sm text-gray-500">
            Date: {sample.metadata?.collectionDate}
          </p>
        </>
      ) : (
        <p className="text-gray-400 italic">No data</p>
      )}
    </div>
  );
}

function ChartBox({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
