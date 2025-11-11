import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Kingdom and project type options
const kingdoms = ["Animalia", "Plantae", "Fungi", "Protista", "Undecided"];
const projectTypes = ["A", "B"];

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

export default function EditSample({ samples, setSamples }) {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [selectedKingdomFilter, setSelectedKingdomFilter] = useState("All");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [editingSample, setEditingSample] = useState(null);

  // Editable form state
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

  // Filtered sample list
  const filteredSamples = samples.filter((sample) => {
    const matchesText =
      sample.sampleName?.toLowerCase().includes(searchText.toLowerCase()) ||
      sample.species?.toLowerCase().includes(searchText.toLowerCase()) ||
      sample.genus?.toLowerCase().includes(searchText.toLowerCase());

    const matchesKingdom =
      selectedKingdomFilter === "All" || sample.kingdom === selectedKingdomFilter;

    const matchesProject =
      selectedProjectFilter === "All" || sample.projectType === selectedProjectFilter;

    let matchesDate = true;
    const sampleDate = new Date(sample.collectionDate || sample.lastEdited);
    if (startDate && endDate) {
      matchesDate = sampleDate >= new Date(startDate) && sampleDate <= new Date(endDate);
    }

    return matchesText && matchesKingdom && matchesProject && matchesDate;
  });

  // Populate form when a sample is selected
  useEffect(() => {
    if (!selectedSampleId) return;
    const sample = samples.find((s) => s.id === selectedSampleId);
    if (!sample) return;

    setEditingSample(sample);

    // Reset form fields properly
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
    setLat(sample.latitude || "");
    setLng(sample.longitude || "");
  }, [selectedSampleId, samples]);

  // Ensure dropdown resets if sampleType changes
  useEffect(() => {
    if (sampleType === "Non-Biological") {
      setSpecies("");
      setGenus("");
      setFamily("");
      setKingdom("Undecided");
      setCollectionDate("");
    }
  }, [sampleType]);

  const handleSave = (e) => {
    e.preventDefault();
    const updatedSample = {
      ...editingSample,
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

    const newSamples = samples.map((s) =>
      s.id === selectedSampleId ? updatedSample : s
    );
    setSamples(newSamples);
    alert("Sample updated!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Edit Sample</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search sample name, species, genus..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
          <select
            value={selectedKingdomFilter}
            onChange={(e) => setSelectedKingdomFilter(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option>All</option>
            {kingdoms.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          <select
            value={selectedProjectFilter}
            onChange={(e) => setSelectedProjectFilter(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option>All</option>
            {projectTypes.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Filtered Sample List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {filteredSamples.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">No samples match your search.</p>
        )}
        {filteredSamples.map((sample) => (
          <div
            key={sample.id}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="font-semibold text-lg mb-1">{sample.sampleName || sample.species}</h2>
            <p className="text-gray-600 text-sm mb-1">Project: {sample.projectType} #{sample.projectNumber}</p>
            <p className="text-gray-600 text-sm mb-1">Sample #: {sample.sampleNumber}</p>
            <p className="text-gray-600 text-sm mb-2">
              Collected: {sample.collectionDate || new Date(sample.lastEdited).toLocaleDateString()}
            </p>
            <button
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
              onClick={() => setSelectedSampleId(sample.id)}
            >
              Edit Sample
            </button>
          </div>
        ))}
      </div>

      {/* Editable Form */}
      {editingSample && (
        <div className="bg-white p-6 rounded-xl shadow-md max-h-screen overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            Editing: {editingSample.sampleName || editingSample.species}
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Sample Photo */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Sample Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSamplePhoto(URL.createObjectURL(e.target.files[0]))}
                className="w-full"
              />
              {samplePhoto && <img src={samplePhoto} alt="Sample" className="mt-2 w-full h-40 object-cover rounded" />}
            </div>

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

            {/* Main Fields */}
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
                  {projectTypes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
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
                <input
                  type="text"
                  value={diveSite}
                  onChange={(e) => setDiveSite(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
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

              {/* Biological-only fields */}
              {sampleType === "Biological" && (
                <>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Species</label>
                    <input
                      type="text"
                      value={species}
                      onChange={(e) => setSpecies(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                        <option key={k} value={k}>{k}</option>
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
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Select Location</label>
                    <MapContainer
                      center={[-8.65, 115.2167]}
                      zoom={10}
                      scrollWheelZoom={true}
                      className="w-full h-96 rounded-xl shadow-md"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {lat && lng && <Marker position={[lat, lng]} />}
                      <LocationPicker setLat={setLat} setLng={setLng} />
                    </MapContainer>
                    <p className="mt-2 text-gray-500 text-sm">
                      Latitude: {lat || "Not selected"}, Longitude: {lng || "Not selected"}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* SEM and Isolated Photos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">SEM Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSemPhoto(URL.createObjectURL(e.target.files[0]))}
                  className="w-full"
                />
                {semPhoto && (
                  <img
                    src={semPhoto}
                    alt="SEM"
                    className="mt-2 w-full h-32 object-cover rounded"
                  />
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Isolated Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIsolatedPhoto(URL.createObjectURL(e.target.files[0]))}
                  className="w-full"
                />
                {isolatedPhoto && (
                  <img
                    src={isolatedPhoto}
                    alt="Isolated"
                    className="mt-2 w-full h-32 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition mt-4"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
