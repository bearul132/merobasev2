import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function SampleDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // fallback if needed

  // 1️⃣ Try to get sample passed via navigate()
  let sample = location.state?.sample;

  // 2️⃣ If not found, try to load samples from localStorage and find by sampleID
  if (!sample && id) {
    const stored = JSON.parse(localStorage.getItem("samples") || "[]");
    sample = stored.find((s) => s.sampleID === id);
  }

  // 3️⃣ Still nothing? Show error
  if (!sample) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-gray-500 mb-4">No sample selected.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Default coordinates if missing
  const lat = sample.latitude || -8.65;
  const lng = sample.longitude || 115.2167;

  return (
    <div className="p-8 max-w-4xl mx-auto mt-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Sample Details
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-6 mb-10">
        {/* SAMPLE INFORMATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <p><strong>Sample ID:</strong> {sample.sampleID}</p>
          <p><strong>Species:</strong> {sample.species || "N/A"}</p>
          <p><strong>Genus:</strong> {sample.genus || "N/A"}</p>
          <p><strong>Family:</strong> {sample.family || "N/A"}</p>
          <p><strong>Kingdom:</strong> {sample.kingdom || "N/A"}</p>
          <p><strong>Project Type:</strong> {sample.projectType || "N/A"}</p>
          <p><strong>Collector:</strong> {sample.collectorName || "N/A"}</p>
          <p><strong>Date Collected:</strong> {sample.collectionDate || "N/A"}</p>
          <p><strong>Dive Site:</strong> {sample.diveSite || "N/A"}</p>
          <p><strong>Location:</strong> {lat}, {lng}</p>
        </div>

        {/* MAP */}
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Sample Location
        </h2>

        <MapContainer
          center={[lat, lng]}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-72 rounded-lg shadow mb-8"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]}>
            <Popup>
              <strong>{sample.species || "Unknown Species"}</strong> <br />
              Project: {sample.projectType || "N/A"} <br />
              {sample.collectionDate || "No date"}
            </Popup>
          </Marker>
        </MapContainer>

        {/* SEM + ISOLATED IMAGES */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Microscopy Photos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SEM Photo */}
          <div className="text-center">
            <p className="font-semibold mb-2">SEM Photo</p>
            {sample.semPhoto ? (
              <img
                src={sample.semPhoto}
                alt="SEM"
                className="w-full h-64 object-cover rounded-lg shadow"
              />
            ) : (
              <p className="text-gray-500 italic">No SEM photo available.</p>
            )}
          </div>

          {/* Isolated Photo */}
          <div className="text-center">
            <p className="font-semibold mb-2">Isolated Photo</p>
            {sample.isolatedPhoto ? (
              <img
                src={sample.isolatedPhoto}
                alt="Isolated"
                className="w-full h-64 object-cover rounded-lg shadow"
              />
            ) : (
              <p className="text-gray-500 italic">No isolated photo available.</p>
            )}
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
