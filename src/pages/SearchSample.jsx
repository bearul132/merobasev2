// src/pages/SearchSample.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { LayoutDashboard, PlusCircle, Search, Edit3, ChevronRight } from "lucide-react";

const kingdoms = ["All", "Animalia", "Plantae", "Fungi", "Protista", "Undecided"];
const projectTypes = ["All", "A", "B"];

export default function SearchSample() {
  const navigate = useNavigate();
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedKingdom, setSelectedKingdom] = useState("All");
  const [selectedProjectType, setSelectedProjectType] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch samples from backend
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await axios.get("https://merobase-backendv2-production-2013.up.railway.app/api/samples");
        setSamples(response.data);
      } catch (error) {
        console.error("Failed to fetch samples:", error);
        alert("Cannot fetch samples from backend. Check the backend status.");
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

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
      matchesDate = sampleDate >= startDate && sampleDate <= endDate;
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
          <ChevronRight className={`transition-transform duration-300 ${sidebarOpen ? "rotate-90" : ""}`} />
          {sidebarOpen && <h1 className="text-lg font-bold text-gray-700">MEROBase</h1>}
        </div>

        <nav className="flex flex-col mt-4 w-full">
          <button onClick={() => navigate("/dashboard")} className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-blue-50 transition rounded-lg">
            <LayoutDashboard className="text-blue-600" />
            {sidebarOpen && <span className="text-gray-700">Dashboard</span>}
          </button>
          <button onClick={() => navigate("/addsample")} className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-green-50 transition rounded-lg">
            <PlusCircle className="text-green-600" />
            {sidebarOpen && <span className="text-gray-700">Add Sample</span>}
          </button>
          <button onClick={() => navigate("/editsample")} className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-yellow-50 transition rounded-lg">
            <Edit3 className="text-yellow-600" />
            {sidebarOpen && <span className="text-gray-700">Edit Sample</span>}
          </button>
          <button onClick={() => navigate("/searchsample")} className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-purple-50 transition rounded-lg">
            <Search className="text-purple-600" />
            {sidebarOpen && <span className="text-gray-700">Search Sample</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all p-6 ${sidebarOpen ? "ml-56" : "ml-16"}`}>
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Search Samples</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6 space-y-4 max-w-4xl">
          <input
            type="text"
            placeholder="Search sample name, species, genus..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={selectedKingdom} onChange={(e) => setSelectedKingdom(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              {kingdoms.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <select value={selectedProjectType} onChange={(e) => setSelectedProjectType(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              {projectTypes.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <DatePicker
              selected={startDate}
              onChange={(dates) => {
                const [start, end] = dates;
                setStartDate(start);
                setEndDate(end);
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              placeholderText="Select date range"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Sample List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {filteredSamples.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">No samples match your search.</p>
          ) : (
            filteredSamples.map((sample) => (
              <div key={sample._id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
                <h2 className="font-semibold text-lg mb-1">{sample.sampleName || sample.species || "Unnamed Sample"}</h2>
                <p className="text-gray-600 text-sm mb-1">Project: {sample.projectType} #{sample.projectNumber || "-"}</p>
                <p className="text-gray-600 text-sm mb-1">Sample #: {sample.sampleNumber || "-"}</p>
                <p className="text-gray-600 text-sm mb-3">
                  Collected: {sample.collectionDate ? new Date(sample.collectionDate).toLocaleDateString() : sample.lastEdited ? new Date(sample.lastEdited).toLocaleDateString() : "-"}
                </p>
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  onClick={() => navigate(`/sampledetails/${sample._id}`, { state: { sample } })}
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
