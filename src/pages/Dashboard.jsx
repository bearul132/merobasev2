import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

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

import { LayoutDashboard, PlusCircle, Edit3, Search, ChevronRight } from "lucide-react";
import "leaflet/dist/leaflet.css";

const kingdomColors = {
  Animalia: "#3B82F6",
  Plantae: "#10B981",
  Fungi: "#F59E0B",
  Other: "#EF4444"
};

export default function Dashboard({ samples: initialSamples }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [samples, setSamples] = useState(initialSamples || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/samples");
        setSamples(res.data);
      } catch (err) {
        console.error("Error fetching samples:", err);
        setSamples(initialSamples || []);
      } finally {
        setLoading(false);
      }
    };
    fetchSamples();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center font-sans">
        <p className="text-gray-500 text-lg">Loading samples...</p>
      </div>
    );
  }

  // Aggregate data
  const kingdomCounts = Object.entries(
    samples.reduce(
      (acc, s) => ({ ...acc, [s.kingdom || "Other"]: (acc[s.kingdom || "Other"] || 0) + 1 }),
      {}
    )
  ).map(([name, value]) => ({ name, value }));

  const projectCounts = Object.entries(
    samples.reduce(
      (acc, s) => ({ ...acc, [s.projectType || "Unknown"]: (acc[s.projectType || "Unknown"] || 0) + 1 }),
      {}
    )
  ).map(([name, value]) => ({ name, value }));

  const dateCounts = Object.entries(
    samples.reduce(
      (acc, s) => ({ ...acc, [s.collectionDate || "Unknown"]: (acc[s.collectionDate || "Unknown"] || 0) + 1 }),
      {}
    )
  ).map(([date, value]) => ({ date, value }));

  const latestRegistered = samples[samples.length - 1] || {};
  const latestEdited = samples[0] || {};

  const totalSamples = samples.length;
  const totalProjects = new Set(samples.map(s => s.projectType)).size;
  const totalKingdoms = new Set(samples.map(s => s.kingdom)).size;
  const totalSpecies = new Set(samples.map(s => s.species)).size;

  const kpiData = [
    { label: "Total Samples", value: totalSamples, color: "bg-blue-500" },
    { label: "Total Projects", value: totalProjects, color: "bg-green-500" },
    { label: "Total Kingdoms", value: totalKingdoms, color: "bg-yellow-500" },
    { label: "Total Species", value: totalSpecies, color: "bg-purple-500" },
  ];

  return (
    <div className="flex min-h-screen font-sans bg-gray-100">
      {/* Sidebar */}
      <div
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`h-screen bg-white shadow-xl transition-all duration-300 fixed
          ${sidebarOpen ? "w-56" : "w-16"} flex flex-col items-start`}
      >
        <div className="flex items-center space-x-2 p-4">
          <ChevronRight
            className={`transition-transform duration-300 ${sidebarOpen ? "rotate-90" : ""}`}
          />
          {sidebarOpen && <h1 className="text-lg font-bold text-gray-700">MEROBase</h1>}
        </div>

        <nav className="flex flex-col mt-4 w-full">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-blue-50 transition rounded-lg"
          >
            <LayoutDashboard className="text-blue-600" />
            {sidebarOpen && <span className="text-gray-700">Dashboard</span>}
          </button>

          <button
            onClick={() => navigate("/add/step1")} // Redirect to wizard first step
            className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-green-50 transition rounded-lg"
          >
            <PlusCircle className="text-green-600" />
            {sidebarOpen && <span className="text-gray-700">Add Sample</span>}
          </button>

          <button
            onClick={() => navigate("/editsample")}
            className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-yellow-50 transition rounded-lg"
          >
            <Edit3 className="text-yellow-600" />
            {sidebarOpen && <span className="text-gray-700">Edit Sample</span>}
          </button>

          <button
            onClick={() => navigate("/searchsample")}
            className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-purple-50 transition rounded-lg"
          >
            <Search className="text-purple-600" />
            {sidebarOpen && <span className="text-gray-700">Search Sample</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-16 md:ml-64 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">MEROBase Dashboard</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, idx) => (
            <div
              key={idx}
              className={`bg-white shadow rounded-xl p-6 flex flex-col justify-center items-start`}
            >
              <span className={`text-white px-2 py-1 rounded ${kpi.color} text-sm font-semibold`}>
                {kpi.label}
              </span>
              <h2 className="text-2xl font-bold mt-2 text-gray-800">{kpi.value}</h2>
            </div>
          ))}
        </div>

        {/* Latest Registered & Edited */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[{
            label: "Latest Registered",
            sample: latestRegistered
          }, {
            label: "Latest Edited",
            sample: latestEdited
          }].map(({ label, sample }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg"
              onClick={() => sample._id && navigate(`/sampledetails/${sample._id}`, { state: { sample } })}
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{label}</h3>
              <p className="text-gray-600 font-medium">{sample.species || "No sample yet"}</p>
              <p className="text-gray-500 text-sm">Project: {sample.projectType || "N/A"}</p>
              <p className="text-gray-500 text-sm">Date Acquired: {sample.collectionDate || "N/A"}</p>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Sample Map (Bali)
          </h3>

          <MapContainer
            center={[-8.65, 115.2167]}
            zoom={10}
            scrollWheelZoom={false}
            className="w-full md:w-4/5 h-96 rounded-xl shadow mx-auto"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {samples.map((s) => (
              <Marker key={s._id} position={[Number(s.latitude), Number(s.longitude)]}>
                <Popup>
                  <strong>{s.species}</strong>
                  <br />
                  Project: {s.projectType}
                  <br />
                  Date: {s.collectionDate}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Kingdom Types</h3>
            <PieChart width={250} height={250}>
              <Pie data={kingdomCounts} dataKey="value" nameKey="name" outerRadius={80} label>
                {kingdomCounts.map((entry, index) => (
                  <Cell key={index} fill={kingdomColors[entry.name] || "#D1D5DB"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Project Types</h3>
            <BarChart width={250} height={250} data={projectCounts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Date Acquired</h3>
            <LineChart width={250} height={250} data={dateCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#10B981" />
            </LineChart>
          </div>
        </div>
      </main>
    </div>
  );
}
