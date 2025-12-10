// src/pages/EditSample.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LayoutDashboard, Search, ChevronRight } from "lucide-react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const kingdoms = ["All", "Animalia", "Plantae", "Fungi", "Protista", "Undecided"];
const projectTypes = ["All", "A", "B"];

export default function EditSample() {
  const navigate = useNavigate();
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [selectedKingdom, setSelectedKingdom] = useState("All");
  const [selectedProjectType, setSelectedProjectType] = useState("All");

  // Date range picker
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showRangePicker, setShowRangePicker] = useState(false);
  const pickerRef = useRef(null);

  // Fetch samples
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const res = await axios.get(
          "https://merobase-backendv2-production-2013.up.railway.app/api/samples"
        );
        setSamples(res.data);
      } catch (err) {
        console.error("Failed to fetch samples:", err);
        alert("Failed to fetch samples from backend");
      } finally {
        setLoading(false);
      }
    };
    fetchSamples();
  }, []);

  // Sync dateRange to formatted strings
  useEffect(() => {
    const sel = dateRange[0];
    if (sel?.startDate && sel?.endDate) {
      setStartDate(format(sel.startDate, "yyyy-MM-dd"));
      setEndDate(format(sel.endDate, "yyyy-MM-dd"));
    } else {
      setStartDate("");
      setEndDate("");
    }
  }, [dateRange]);

  // Close date picker if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowRangePicker(false);
      }
    }
    if (showRangePicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showRangePicker]);

  // Filter samples
  const filteredSamples = samples.filter((sample) => {
    const matchesText =
      (sample.sampleName?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
      (sample.species?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
      (sample.genus?.toLowerCase().includes(searchText.toLowerCase()) ?? false);

    const matchesKingdom = selectedKingdom === "All" || sample.kingdom === selectedKingdom;
    const matchesProject = selectedProjectType === "All" || sample.projectType === selectedProjectType;

    let matchesDate = true;
    const sampleDate = sample.collectionDate
      ? new Date(sample.collectionDate)
      : sample.lastEdited
      ? new Date(sample.lastEdited)
      : null;

    if (sampleDate && startDate && endDate) {
      matchesDate =
        sampleDate >= new Date(startDate) && sampleDate <= new Date(endDate);
    }

    return matchesText && matchesKingdom && matchesProject && matchesDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading samples...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
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
            onClick={() => navigate("/searchsample")}
            className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-purple-50 transition rounded-lg"
          >
            <Search className="text-purple-600" />
            {sidebarOpen && <span className="text-gray-700">Search Sample</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all p-6 ${sidebarOpen ? "ml-56" : "ml-16"}`}>
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Edit Sample</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6 max-w-4xl">
          <input
            type="text"
            placeholder="Search sample name, species, genus..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Kingdom */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Kingdom</label>
              <select
                value={selectedKingdom}
                onChange={(e) => setSelectedKingdom(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {kingdoms.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            {/* Project Type */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Project Type</label>
              <select
                value={selectedProjectType}
                onChange={(e) => setSelectedProjectType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {projectTypes.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Date Range Picker */}
            <div className="relative w-full" ref={pickerRef}>
              <label className="text-sm font-semibold text-gray-600 mb-1">Date Range</label>
              <button
                type="button"
                onClick={() => setShowRangePicker((s) => !s)}
                className="w-full px-4 py-2 border rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {startDate && endDate
                  ? `${format(new Date(startDate), "dd MMM yyyy")} — ${format(new Date(endDate), "dd MMM yyyy")}`
                  : "Select date range"}
              </button>

              {showRangePicker && (
                <div className="absolute z-50 mt-2">
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    maxDate={new Date()}
                    className="shadow-lg rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sample Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {filteredSamples.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">No samples match your search.</p>
          ) : (
            filteredSamples.map((sample) => <SampleCard key={sample._id} sample={sample} navigate={navigate} />)
          )}
        </div>
      </div>
    </div>
  );
}

// Expandable Sample Card
function SampleCard({ sample, navigate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 ${
        expanded ? "max-h-full" : "max-h-40 overflow-hidden"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-lg mb-1">
            {sample.sampleName || sample.species || "Unnamed Sample"}
          </h2>
          <p className="text-gray-600 text-sm mb-1">
            Project: {sample.projectType} #{sample.projectNumber || "-"}
          </p>
          <p className="text-gray-600 text-sm mb-1">Sample #: {sample.sampleNumber || "-"}</p>
        </div>

        <button
          className="text-blue-600 text-sm hover:underline"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Minimize" : "Expand"}
        </button>
      </div>

      {expanded && (
        <div className="mt-2 text-gray-600 text-sm space-y-1">
          <p>
            Collected:{" "}
            {sample.collectionDate
              ? new Date(sample.collectionDate).toLocaleDateString()
              : sample.lastEdited
              ? new Date(sample.lastEdited).toLocaleDateString()
              : "-"}
          </p>
          {sample.kingdom && <p>Kingdom: {sample.kingdom}</p>}
          {sample.genus && <p>Genus: {sample.genus}</p>}
          {sample.species && <p>Species: {sample.species}</p>}
          {sample.family && <p>Family: {sample.family}</p>}
          {sample.storageLocation && <p>Stored at: {sample.storageLocation}</p>}

          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              onClick={() => navigate(`/sampledetails/${sample._id}`, { state: { sample } })}
            >
              View Full Details
            </button>
            <button
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
              onClick={() => navigate(`/editform/${sample._id}`, { state: { sample } })}
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
