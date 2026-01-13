import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Edit3,
  Search as SearchIcon,
  ChevronRight,
  Calendar
} from "lucide-react";
import { DateRange } from "react-date-range";
import { useSampleFormContext } from "../context/SampleFormContext";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const STORAGE_KEY = "merobase_samples";

export default function EditSample() {
  const navigate = useNavigate();
  const { loadSampleForEdit, clearDraft } = useSampleFormContext();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [samples, setSamples] = useState([]);

  /* ================= FILTER STATES ================= */
  const [query, setQuery] = useState("");
  const [kingdom, setKingdom] = useState("");
  const [projectType, setProjectType] = useState("");
  const [sampleType, setSampleType] = useState("");

  /* ===== Date Range ===== */
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const [range, setRange] = useState([
    { startDate: null, endDate: null, key: "selection" }
  ]);

  /* ================= LOAD LOCALSTORAGE ================= */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setSamples(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSamples([]);
    }
  }, []);

  /* ================= DROPDOWN OPTIONS ================= */
  const kingdoms = useMemo(
    () =>
      [...new Set(samples.map(s => s.metadata?.kingdom).filter(Boolean))],
    [samples]
  );

  const projectTypes = useMemo(
    () =>
      [...new Set(samples.map(s => s.metadata?.projectType).filter(Boolean))],
    [samples]
  );

  /* ================= FILTER LOGIC ================= */
  const filteredSamples = useMemo(() => {
    return samples.filter(sample => {
      if (!sample?.metadata?.sampleId) return false;

      const m = sample.metadata;
      const searchable = Object.values(m).join(" ").toLowerCase();

      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesKingdom = !kingdom || m.kingdom === kingdom;
      const matchesProject = !projectType || m.projectType === projectType;
      const matchesType = !sampleType || m.sampleType === sampleType;

      let matchesDate = true;
      if (
        range[0].startDate &&
        range[0].endDate &&
        m.collectionDate
      ) {
        const d = new Date(m.collectionDate);
        matchesDate =
          d >= range[0].startDate && d <= range[0].endDate;
      }

      return (
        matchesQuery &&
        matchesKingdom &&
        matchesProject &&
        matchesType &&
        matchesDate
      );
    });
  }, [
    samples,
    query,
    kingdom,
    projectType,
    sampleType,
    range
  ]);

  /* ================= ACTIONS ================= */
  const handleEdit = (sample) => {
    if (!sample?.metadata?.sampleId) return;
    loadSampleForEdit(sample);
    navigate("/addsample");
  };

  const handleDetails = (sample) => {
    navigate(`/sample/${sample.metadata.sampleId}`);
  };

  const handleCancel = () => {
    clearDraft();
    navigate("/dashboard");
  };

  /* ================= UI ================= */
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`bg-white shadow-xl transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } h-screen flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-700">MEROBase</h1>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <ChevronRight
              className={`text-gray-600 transition-transform ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <nav className="flex flex-col mt-4">
          <SidebarButton
            icon={<LayoutDashboard className="text-blue-600" />}
            label="Dashboard"
            open={sidebarOpen}
            onClick={() => navigate("/dashboard")}
          />
          <SidebarButton
            icon={<PlusCircle className="text-green-600" />}
            label="Add Sample"
            open={sidebarOpen}
            onClick={() => navigate("/addsample")}
          />
          <SidebarButton
            icon={<Edit3 className="text-yellow-600" />}
            label="Edit Sample"
            open={sidebarOpen}
            active
          />
          <SidebarButton
            icon={<SearchIcon className="text-purple-600" />}
            label="Search Sample"
            open={sidebarOpen}
            onClick={() => navigate("/searchsample")}
          />
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main
        className={`flex-1 p-8 transition-all ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Samples</h1>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
        </div>

        {/* ================= FILTER PANEL ================= */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <SearchIcon
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by any keyword..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="pl-10 w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Kingdom */}
            <select
              value={kingdom}
              onChange={e => setKingdom(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">All Kingdoms</option>
              {kingdoms.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>

            {/* Project */}
            <select
              value={projectType}
              onChange={e => setProjectType(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">All Projects</option>
              {projectTypes.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Sample Type */}
            <select
              value={sampleType}
              onChange={e => setSampleType(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">All Sample Types</option>
              <option value="Biological">Biological</option>
              <option value="Non Biological">Non Biological</option>
            </select>

            {/* Date Range */}
            <div ref={pickerRef} className="relative md:col-span-2">
              <label className="text-sm font-semibold flex items-center gap-1 mb-1">
                <Calendar size={14} /> Collection Date
              </label>
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="w-full px-4 py-2 border rounded-lg text-left bg-white"
              >
                {range[0].startDate && range[0].endDate
                  ? `${range[0].startDate.toLocaleDateString()} – ${range[0].endDate.toLocaleDateString()}`
                  : "Select date range"}
              </button>

              {showPicker && (
                <div className="absolute z-50 mt-2">
                  <DateRange
                    ranges={range}
                    onChange={(item) =>
                      setRange([item.selection])
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= SAMPLE CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredSamples.length === 0 ? (
            <p className="text-gray-500 italic col-span-full">
              No samples found.
            </p>
          ) : (
            filteredSamples.map(sample => {
              const m = sample.metadata;
              return (
                <div
                  key={m.sampleId}
                  className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {m.sampleName || "Unnamed Sample"}
                  </h3>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Project: {m.projectType || "—"}</p>
                    <p>Kingdom: {m.kingdom || "—"}</p>
                    <p>Sample Type: {m.sampleType || "—"}</p>
                    <p>Date: {m.collectionDate || "—"}</p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleDetails(sample)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleEdit(sample)}
                      className="flex-1 px-3 py-2 text-sm bg-gray-200 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

/* ================= SIDEBAR BUTTON ================= */
function SidebarButton({ icon, label, open, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition
        ${active ? "bg-purple-50" : "hover:bg-gray-100"}`}
    >
      {icon}
      {open && <span className="text-gray-700">{label}</span>}
    </button>
  );
}
