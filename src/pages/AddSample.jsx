import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LayoutDashboard, PlusCircle, Edit3, Search, ChevronRight } from "lucide-react";

// Dive sites
const diveSites = [
  "USAT Liberty",
  "Drop Off",
  "Bunutan",
  "Kubu",
  "Pyramids",
  "Rising Sun",
  "Temple",
  "Siladen",
];

// Kingdom options
const kingdoms = ["Animalia", "Plantae", "Fungi", "Protista", "Undecided"];

// Map click component
function LocationPicker({ setLat, setLng }) {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat.toFixed(6));
      setLng(e.latlng.lng.toFixed(6));
    },
  });
  return null;
}

export default function AddNewSample({ samples, setSamples }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [sampleType, setSampleType] = useState("Biological");

  // Common fields
  const [sampleName, setSampleName] = useState("");
  const [projectType, setProjectType] = useState("A");
  const [projectNumber, setProjectNumber] = useState("");
  const [sampleNumber, setSampleNumber] = useState(""); // <-- restored field
  const [diveSite, setDiveSite] = useState("");
  const [collectorName, setCollectorName] = useState("");

  // Biological-only fields
  const [species, setSpecies] = useState("");
  const [genus, setGenus] = useState("");
  const [family, setFamily] = useState("");
  const [kingdom, setKingdom] = useState("Undecided");
  const [collectionDate, setCollectionDate] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // Clear biological fields if type changes
  useEffect(() => {
    if (sampleType !== "Biological") {
      setSpecies("");
      setGenus("");
      setFamily("");
      setKingdom("Undecided");
      setCollectionDate("");
      setLat("");
      setLng("");
    }
  }, [sampleType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sampleType === "Biological") {
      if (!species || !collectionDate || !diveSite || !lat || !lng) {
        alert(
          "Please fill all required Biological fields and select a location on the map."
        );
        return;
      }
    }

    // Auto-generate Sample Number if not manually set
    let finalSampleNumber = Number(sampleNumber);
    if (!finalSampleNumber) {
      const filteredByProject = samples.filter(
        (s) => s.projectType === projectType && s.projectNumber === Number(projectNumber)
      );
      const maxSampleNumber = filteredByProject.reduce(
        (max, s) => Math.max(max, s.sampleNumber || 0),
        0
      );
      finalSampleNumber = maxSampleNumber + 1;
    }

    // Build Sample ID
    const sampleID = `${projectType}-${projectNumber}-${String(finalSampleNumber).padStart(
      3,
      "0"
    )}`;

    const newSample = {
      sampleID,
      sampleType,
      sampleName,
      projectType,
      projectNumber: projectNumber ? Number(projectNumber) : undefined,
      sampleNumber: finalSampleNumber,
      diveSite,
      collectorName,
    };

    if (sampleType === "Biological") {
      Object.assign(newSample, {
        species,
        genus,
        family,
        kingdom,
        collectionDate: new Date(collectionDate),
        latitude: lat ? parseFloat(lat) : undefined,
        longitude: lng ? parseFloat(lng) : undefined,
      });
    }

    try {
      const response = await axios.post(
        "https://merobase-backendv2-production-2013.up.railway.app/api/samples",
        newSample,
        { headers: { "Content-Type": "application/json" } }
      );

      setSamples([...samples, response.data]);
      alert(`Sample submitted successfully!\nSample ID: ${sampleID}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting sample:", error);
      alert("Failed to submit sample. Check console for details.");
    }
  };

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
            onClick={() => navigate("/addsample")}
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
      <div className="flex-1 ml-16 md:ml-64 p-6 transition-all">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
          Add New Sample
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg"
        >
          {/* Sample Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Sample Type</label>
            <select
              value={sampleType}
              onChange={(e) => setSampleType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Biological</option>
              <option>Non-Biological</option>
            </select>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Sample Name</label>
              <input
                type="text"
                value={sampleName}
                onChange={(e) => setSampleName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option>A</option>
                <option>B</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Project Number</label>
              <input
                type="number"
                value={projectNumber}
                onChange={(e) => setProjectNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Sample Number</label>
              <input
                type="number"
                value={sampleNumber}
                onChange={(e) => setSampleNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Dive Site</label>
              <select
                value={diveSite}
                onChange={(e) => setDiveSite(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required={sampleType === "Biological"}
              >
                <option value="">Select a site</option>
                {diveSites.map((site) => (
                  <option key={site} value={site}>
                    {site}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Collector Name</label>
              <input
                type="text"
                value={collectorName}
                onChange={(e) => setCollectorName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Biological Fields */}
          {sampleType === "Biological" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Species</label>
                <input
                  type="text"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Genus</label>
                <input
                  type="text"
                  value={genus}
                  onChange={(e) => setGenus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Family</label>
                <input
                  type="text"
                  value={family}
                  onChange={(e) => setFamily(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Kingdom</label>
                <select
                  value={kingdom}
                  onChange={(e) => setKingdom(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {kingdoms.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Collection Date</label>
                <input
                  type="date"
                  value={collectionDate}
                  onChange={(e) => setCollectionDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Select Location</label>
                <MapContainer
                  center={lat && lng ? [lat, lng] : [-8.65, 115.2167]}
                  zoom={10}
                  scrollWheelZoom
                  className="w-full h-72 rounded-xl shadow mb-2"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {lat && lng && <Marker position={[lat, lng]} />}
                  <LocationPicker setLat={setLat} setLng={setLng} />
                </MapContainer>
                <p className="text-gray-500 text-sm">
                  Latitude: {lat || "Not selected"} — Longitude: {lng || "Not selected"}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition mt-4"
          >
            Submit Sample
          </button>
        </form>
      </div>
    </div>
  );
}
