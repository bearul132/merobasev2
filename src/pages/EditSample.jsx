import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSampleFormContext } from "../context/SampleFormContext";
import { DateRange } from "react-date-range";
import {
  LayoutDashboard,
  Search,
  Edit3,
  ChevronRight
} from "lucide-react";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

/* ================= CONSTANTS ================= */

const KINGDOMS = ["All", "Animalia", "Plantae", "Fungi", "Protista", "Undecided"];
const PROJECTS = ["All", "A", "B", "C"];
const SAMPLE_TYPES = ["All", "Biological", "Non Biological"];

/* ================= COMPONENT ================= */

export default function EditSample() {
  const navigate = useNavigate();
  const { loadSampleForEdit } = useSampleFormContext();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [samples, setSamples] = useState([]);

  /* ===== Filters ===== */
  const [search, setSearch] = useState("");
  const [kingdom, setKingdom] = useState("All");
  const [projectType, setProjectType] = useState("All");
  const [sampleType, setSampleType] = useState("All");

  /* ===== Date Range ===== */
  const pickerRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  const [range, setRange] = useState([
    { startDate: null, endDate: null, key: "selection" }
  ]);

  /* ================= LOAD LOCALSTORAGE ================= */

  useEffect(() => {
    try {
      const stored =
        JSON.parse(localStorage.getItem("merobase_samples")) || [];
      setSamples(stored);
    } catch {
      setSamples([]);
    }
  }, []);

  /* ================= FILTER LOGIC ================= */

  const filteredSamples = useMemo(() => {
    return samples.filter((s) => {
      const m = s.metadata || {};

      const keyword = search.toLowerCase();
      const matchText =
        m.sampleName?.toLowerCase().includes(keyword) ||
        m.species?.toLowerCase().includes(keyword) ||
        m.genus?.toLowerCase().includes(keyword);

      const matchKingdom =
        kingdom === "All" || m.kingdom === kingdom;
      const matchProject =
        projectType === "All" || m.projectType === projectType;
      const matchSampleType =
        sampleType === "All" || m.sampleType === sampleType;

      let matchDate = true;
      if (range[0].startDate && range[0].endDate && m.collectionDate) {
        const d = new Date(m.collectionDate);
        matchDate =
          d >= range[0].startDate && d <= range[0].endDate;
      }

      return (
        matchText &&
        matchKingdom &&
        matchProject &&
        matchSampleType &&
        matchDate
      );
    });
  }, [samples, search, kingdom, projectType, sampleType, range]);

  /* ================= ACTIONS ================= */

  const handleEdit = (sample) => {
    loadSampleForEdit(sample);
    navigate("/add/step1");
  };

  const handleDetails = (sample) => {
    navigate(`/sample/${sample.metadata.sampleId}`, {
      state: { sample }
    });
  };

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* ================= SIDEBAR ================= */}
      <aside
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`bg-white shadow-xl transition-all duration-300
        ${sidebarOpen ? "w-56" : "w-16"} flex flex-col`}
      >
        <div className="flex items-center gap-2 p-4">
          <ChevronRight
            className={`transition-transform ${
              sidebarOpen ? "rotate-90" : ""
            }`}
          />
          {sidebarOpen && (
            <h1 className="text-lg font-bold text-gray-700">
              MEROBase
            </h1>
          )}
        </div>

        <nav className="flex flex-col mt-4">
          <SidebarBtn
            icon={<LayoutDashboard className="text-blue-600" />}
            label="Dashboard"
            open={sidebarOpen}
            onClick={() => navigate("/dashboard")}
          />
          <SidebarBtn
            icon={<Search className="text-purple-600" />}
            label="Search Sample"
            open={sidebarOpen}
            onClick={() => navigate("/searchsample")}
          />
          <SidebarBtn
            icon={<Edit3 className="text-green-600" />}
            label="Edit Sample"
            open={sidebarOpen}
            active
          />
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Samples
        </h1>

        {/* ================= FILTER PANEL ================= */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-6xl">
          <input
            type="text"
            placeholder="Search sample name, species, genus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Kingdom"
              value={kingdom}
              onChange={setKingdom}
              options={KINGDOMS}
            />
            <Select
              label="Project Type"
              value={projectType}
              onChange={setProjectType}
              options={PROJECTS}
            />
            <Select
              label="Sample Type"
              value={sampleType}
              onChange={setSampleType}
              options={SAMPLE_TYPES}
            />

            {/* Date Picker */}
            <div ref={pickerRef}>
              <label className="text-sm font-semibold">
                Date Range
              </label>
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="w-full px-4 py-2 border rounded-lg text-left"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
          {filteredSamples.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No samples found.
            </p>
          ) : (
            filteredSamples.map((sample) => {
              const m = sample.metadata || {};
              return (
                <div
                  key={m.sampleId}
                  className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
                >
                  <h2 className="font-semibold text-lg mb-1">
                    {m.sampleName || "Unnamed Sample"}
                  </h2>

                  <p className="text-sm text-gray-600">
                    Project: {m.projectType || "-"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Kingdom: {m.kingdom || "-"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Sample Type: {m.sampleType || "-"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date:{" "}
                    {m.collectionDate
                      ? new Date(
                          m.collectionDate
                        ).toLocaleDateString()
                      : "-"}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleDetails(sample)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleEdit(sample)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm"
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

/* ================= SUB COMPONENTS ================= */

function SidebarBtn({ icon, label, open, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
      ${active ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"}`}
    >
      {icon}
      {open && <span>{label}</span>}
    </button>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
