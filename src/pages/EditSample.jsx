// src/pages/EditSample.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LayoutDashboard, PlusCircle, Search, Edit3, ChevronRight } from "lucide-react";

const diveSites = [
  "USAT Liberty",
  "Drop Off",
  "Bunutan",
  "Kubu",
  "Pyramids",
  "Rising Sun",
  "Temple",
  "Siladen",
  "Other"
];

const kingdoms = ["Animalia", "Plantae", "Fungi", "Protista", "Undecided"];
const projectTypes = ["A", "B"];

export default function EditSample() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [selectedKingdomFilter, setSelectedKingdomFilter] = useState("All");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("All");

  // Use local backend URL
  const backendURL = "http://localhost:5000/api/samples";

  // Fetch samples once
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const res = await axios.get(backendURL);
        setSamples(res.data);
      } catch (err) {
        console.error("Failed to fetch samples:", err);
        alert("Failed to fetch samples from local backend. Make sure your server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchSamples();
  }, [backendURL]);

  // Filter samples
  const filteredSamples = samples.filter((sample) => {
    const q = searchText.trim().toLowerCase();
    const textMatch =
      !q ||
      (sample.sampleName?.toLowerCase() || "").includes(q) ||
      (sample.species?.toLowerCase() || "").includes(q) ||
      (sample.genus?.toLowerCase() || "").includes(q);

    const kingdomMatch =
      selectedKingdomFilter === "All" || sample.kingdom === selectedKingdomFilter;
    const projectMatch =
      selectedProjectFilter === "All" || sample.projectType === selectedProjectFilter;

    return textMatch && kingdomMatch && projectMatch;
  });

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading samples...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <div
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`fixed top-0 left-0 h-screen bg-white shadow-xl transition-all duration-300 ${
          sidebarOpen ? "w-56" : "w-16"
        } flex flex-col items-start`}
      >
        <div className="flex items-center space-x-2 p-4 w-full">
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

      {/* Main */}
      <div className={`flex-1 transition-all duration-300 p-6 ${sidebarOpen ? "ml-56" : "ml-16"}`}>
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Edit Sample</h1>

        <div className="bg-white p-6 rounded-xl shadow-md mb-6 max-w-5xl mx-auto">
          {/* Search & Filters */}
          <input
            type="text"
            placeholder="Search sample name, species, genus..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 items-center">
            <select value={selectedKingdomFilter} onChange={(e) => setSelectedKingdomFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option value="All">All</option>
              {kingdoms.map((k) => (<option key={k} value={k}>{k}</option>))}
            </select>

            <select value={selectedProjectFilter} onChange={(e) => setSelectedProjectFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option value="All">All</option>
              {projectTypes.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>
          </div>

          {/* Sample List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSamples.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full">No samples match your filters.</p>
            ) : (
              filteredSamples.map((s) => (
                <div key={s.sampleID || s._id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
                  <h2 className="font-semibold text-lg">{s.sampleName || s.species || "Unnamed Sample"}</h2>
                  <p className="text-gray-600 text-sm">Project: {s.projectType} #{s.projectNumber ?? s.project_number ?? "-"}</p>
                  <p className="text-gray-600 text-sm">Sample #: {s.sampleNumber ?? s.sample_number ?? "-"}</p>
                  <p className="text-gray-600 text-sm mb-3">Collected: {s.collectionDate ? new Date(s.collectionDate).toLocaleDateString() : s.lastEdited ? new Date(s.lastEdited).toLocaleDateString() : "-"}</p>

                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/editform/${s.sampleID}`, { state: { sample: s } })} className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm">Edit Sample</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
