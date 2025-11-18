// src/pages/EditSample.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { LayoutDashboard, PlusCircle, Search, Edit3, ChevronRight } from "lucide-react";

const kingdoms = ["Animalia", "Plantae", "Fungi", "Protista", "Undecided"];
const projectTypes = ["A", "B"];

function LocationPicker({ setLat, setLng }) {
  useMapEvents({
    click(e) {
      setLat(Number(e.latlng.lat).toFixed(6));
      setLng(Number(e.latlng.lng).toFixed(6));
    },
  });
  return null;
}

const handleFileChange = (e, setter) => {
  if (e.target.files && e.target.files[0]) {
    setter(URL.createObjectURL(e.target.files[0]));
  }
};

export default function EditSample() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [selectedKingdomFilter, setSelectedKingdomFilter] = useState("All");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Editing
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [editingSample, setEditingSample] = useState(null);

  // Form state
  const [sampleType, setSampleType] = useState("Biological");
  const [samplePhoto, setSamplePhoto] = useState(null);
  const [semPhoto, setSemPhoto] = useState(null);
  const [isolatedPhoto, setIsolatedPhoto] = useState(null);

  const [sampleName, setSampleName] = useState("");
  const [projectType, setProjectType] = useState("A");
  const [projectNumber, setProjectNumber] = useState("");
  const [sampleNumber, setSampleNumber] = useState("");
  const [diveSite, setDiveSite] = useState("");
  const [collectorName, setCollectorName] = useState("");

  const [species, setSpecies] = useState("");
  const [genus, setGenus] = useState("");
  const [family, setFamily] = useState("");
  const [kingdom, setKingdom] = useState("Undecided");
  const [collectionDate, setCollectionDate] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // Fetch samples from backend
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const res = await axios.get("https://merobase-backendv2-production-2013.up.railway.app/api/samples");
        setSamples(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch samples from backend");
      } finally {
        setLoading(false);
      }
    };
    fetchSamples();
  }, []);

  const filteredSamples = samples.filter((sample) => {
    const textMatch =
      (sample.sampleName?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
      (sample.species?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
      (sample.genus?.toLowerCase().includes(searchText.toLowerCase()) ?? false);

    const kingdomMatch = selectedKingdomFilter === "All" || sample.kingdom === selectedKingdomFilter;
    const projectMatch = selectedProjectFilter === "All" || sample.projectType === selectedProjectFilter;

    let dateMatch = true;
    const sampleDate = sample.collectionDate ? new Date(sample.collectionDate) : sample.lastEdited ? new Date(sample.lastEdited) : null;
    if (sampleDate && startDate && endDate) {
      dateMatch = sampleDate >= new Date(startDate) && sampleDate <= new Date(endDate);
    }
    return textMatch && kingdomMatch && projectMatch && dateMatch;
  });

  // Load selected sample
  useEffect(() => {
    if (!selectedSampleId) return setEditingSample(null);
    const sample = samples.find((s) => s._id === selectedSampleId);
    if (!sample) return;

    setEditingSample(sample);

    setSampleType(sample.sampleType || "Biological");
    setSamplePhoto(sample.samplePhoto || null);
    setSemPhoto(sample.semPhoto || null);
    setIsolatedPhoto(sample.isolatedPhoto || null);

    setSampleName(sample.sampleName || "");
    setProjectType(sample.projectType || "A");
    setProjectNumber(sample.projectNumber || "");
    setSampleNumber(sample.sampleNumber || "");
    setDiveSite(sample.diveSite || "");
    setCollectorName(sample.collectorName || "");

    setSpecies(sample.species || "");
    setGenus(sample.genus || "");
    setFamily(sample.family || "");
    setKingdom(sample.kingdom || "Undecided");
    setCollectionDate(sample.collectionDate || "");
    setLat(sample.latitude ?? "");
    setLng(sample.longitude ?? "");
  }, [selectedSampleId, samples]);

  useEffect(() => {
    if (sampleType === "Non-Biological") {
      setSpecies(""); setGenus(""); setFamily(""); setKingdom("Undecided"); setCollectionDate(""); setLat(""); setLng("");
    }
  }, [sampleType]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingSample) return alert("No sample selected to update.");

    const updatedSample = {
      sampleType,
      samplePhoto,
      semPhoto,
      isolatedPhoto,
      sampleName,
      projectType,
      projectNumber,
      sampleNumber,
      diveSite,
      collectorName,
      species: sampleType === "Biological" ? species : undefined,
      genus: sampleType === "Biological" ? genus : undefined,
      family: sampleType === "Biological" ? family : undefined,
      kingdom: sampleType === "Biological" ? kingdom : undefined,
      collectionDate: sampleType === "Biological" ? collectionDate : undefined,
      latitude: lat,
      longitude: lng,
      lastEdited: new Date(),
    };

    try {
      await axios.put(`https://merobase-backendv2-production-2013.up.railway.app/api/samples/${selectedSampleId}`, updatedSample);
      alert("Sample updated successfully!");
      setSamples(samples.map((s) => (s._id === selectedSampleId ? { ...s, ...updatedSample } : s)));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update sample on backend");
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading samples...</div>;

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <div
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`fixed top-0 left-0 h-screen bg-white shadow-xl transition-all duration-300 ${sidebarOpen ? "w-56" : "w-16"} flex flex-col items-start`}
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

        {/* Filter + List */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6 max-w-5xl mx-auto">
          <input type="text" placeholder="Search sample name, species, genus..." value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <select value={selectedKingdomFilter} onChange={(e) => setSelectedKingdomFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option>All</option>
              {kingdoms.map((k) => <option key={k}>{k}</option>)}
            </select>
            <select value={selectedProjectFilter} onChange={(e) => setSelectedProjectFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option>All</option>
              {projectTypes.map((p) => <option key={p}>{p}</option>)}
            </select>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-4 py-2 border rounded-lg" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-4 py-2 border rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {filteredSamples.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full">No samples match your filters.</p>
            ) : (
              filteredSamples.map((sample) => (
                <div key={sample._id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
                  <h2 className="font-semibold text-lg">{sample.sampleName || sample.species || "Unnamed Sample"}</h2>
                  <p className="text-gray-600 text-sm">Project: {sample.projectType} #{sample.projectNumber ?? "-"}</p>
                  <p className="text-gray-600 text-sm">Sample #: {sample.sampleNumber ?? "-"}</p>
                  <p className="text-gray-600 text-sm mb-3">Collected: {sample.collectionDate ? new Date(sample.collectionDate).toLocaleDateString() : sample.lastEdited ? new Date(sample.lastEdited).toLocaleDateString() : "-"}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedSampleId(sample._id)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm">
                      Edit Sample
                    </button>
                    <button onClick={() => navigate(`/sampledetails/${sample._id}`, { state: { sample } })} className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Edit Form */}
          {editingSample && (
            <div className="bg-white p-6 rounded-xl shadow-md mt-6">
              <h2 className="text-xl font-semibold mb-4">Editing: {editingSample.sampleName || editingSample.species}</h2>
              <form onSubmit={handleSave} className="space-y-5">
                {/* Sample Photo */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Sample Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setSamplePhoto)} />
                  {samplePhoto && <img src={samplePhoto} alt="Sample" className="mt-2 w-full h-40 object-cover rounded" />}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Sample Type</label>
                  <select value={sampleType} onChange={(e) => setSampleType(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                    <option>Biological</option>
                    <option>Non-Biological</option>
                  </select>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[{ label: "Sample Name", value: sampleName, setter: setSampleName, type: "text", required: true },
                    { label: "Project Number", value: projectNumber, setter: setProjectNumber, type: "number" },
                    { label: "Sample Number", value: sampleNumber, setter: setSampleNumber, type: "number" },
                    { label: "Dive Site", value: diveSite, setter: setDiveSite, type: "text" },
                    { label: "Collector Name", value: collectorName, setter: setCollectorName, type: "text" },
                  ].map(({ label, value, setter, type, required }, idx) => (
                    <div key={idx}>
                      <label className="block text-gray-700 font-medium mb-1">{label}</label>
                      <input type={type} value={value} onChange={(e) => setter(e.target.value)} className="w-full px-4 py-2 border rounded-lg" {...(required ? { required: true } : {})} />
                    </div>
                  ))}

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Project Type</label>
                    <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                      {projectTypes.map((p) => (<option key={p}>{p}</option>))}
                    </select>
                  </div>

                  {sampleType === "Biological" && (
                    <>
                      {[{ label: "Species", value: species, setter: setSpecies },
                        { label: "Genus", value: genus, setter: setGenus },
                        { label: "Family", value: family, setter: setFamily },
                      ].map(({ label, value, setter }, idx) => (
                        <div key={idx}>
                          <label className="block text-gray-700 font-medium mb-1">{label}</label>
                          <input type="text" value={value} onChange={(e) => setter(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                      ))}

                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Kingdom</label>
                        <select value={kingdom} onChange={(e) => setKingdom(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                          {kingdoms.map((k) => (<option key={k}>{k}</option>))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Collection Date</label>
                        <input type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-1">Select Location</label>
                        <MapContainer center={lat && lng ? [lat, lng] : [-8.65, 115.2167]} zoom={10} scrollWheelZoom className="w-full h-72 rounded-xl shadow mb-2">
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          {lat && lng && <Marker position={[lat, lng]} />}
                          <LocationPicker setLat={setLat} setLng={setLng} />
                        </MapContainer>
                        <p className="text-gray-500 text-sm">Latitude: {lat || "Not selected"} — Longitude: {lng || "Not selected"}</p>
                      </div>
                    </>
                  )}

                  {[{ label: "SEM Photo", setter: setSemPhoto, value: semPhoto },
                    { label: "Isolated Photo", setter: setIsolatedPhoto, value: isolatedPhoto },
                  ].map(({ label, setter, value }, idx) => (
                    <div key={idx}>
                      <label className="block text-gray-700 font-medium mb-1">{label}</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setter)} />
                      {value && <img src={value} alt={label} className="mt-2 w-full h-40 object-cover rounded" />}
                    </div>
                  ))}
                </div>

                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
