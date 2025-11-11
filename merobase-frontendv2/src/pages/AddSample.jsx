import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Tulamben dive sites
const diveSites = [
  "USAT Liberty", "Drop Off", "Bunutan", "Kubu", "Pyramids", "Rising Sun", "Temple", "Siladen"
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

  const [sampleType, setSampleType] = useState("Biological");
  const [samplePhoto, setSamplePhoto] = useState(null);
  const [semPhoto, setSemPhoto] = useState(null);
  const [isolatedPhoto, setIsolatedPhoto] = useState(null);

  // Common fields
  const [sampleName, setSampleName] = useState("");
  const [projectType, setProjectType] = useState("A");
  const [projectNumber, setProjectNumber] = useState("");
  const [sampleNumber, setSampleNumber] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSample = {
      id: `SMP-${samples.length + 1}`,
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

    setSamples([...samples, newSample]);

    console.log("Submitting Sample:", newSample);
    alert("Sample submitted!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-blue-600 text-center">Add New Sample</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sample Photo on top */}
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

          {/* Dynamic Form */}
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
              >
                <option value="">Select a site</option>
                {diveSites.map((site) => (
                  <option key={site} value={site}>{site}</option>
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
                  <label className="block text-gray-700 font-medium mb-2">Select Location (Decimal Degrees)</label>
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
              {semPhoto && <img src={semPhoto} alt="SEM" className="mt-2 w-full h-32 object-cover rounded" />}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Isolated Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIsolatedPhoto(URL.createObjectURL(e.target.files[0]))}
                className="w-full"
              />
              {isolatedPhoto && <img src={isolatedPhoto} alt="Isolated" className="mt-2 w-full h-32 object-cover rounded" />}
            </div>
          </div>

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
