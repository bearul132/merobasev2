// src/pages/SampleDetails.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { LayoutDashboard, PlusCircle, Edit3, Search, ChevronRight } from "lucide-react";
import axios from "axios";

export default function SampleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sample, setSample] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState({
    basic: true,
    morphology: true,
    microbiology: true,
    molecular: true,
  });

  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const fetchSample = async () => {
      try {
        const res = await axios.get(
          `https://merobase-backendv2-production-2013.up.railway.app/api/samples/${id}`
        );
        setSample(res.data);
      } catch (err) {
        console.error("Failed to fetch sample:", err);
        alert("Failed to fetch sample from backend");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSample();
  }, [id]);

  const TableCard = ({ title, children }) => (
    <div className="bg-white shadow rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );

  const renderRow = (label, value) => (
    <tr className="border-b">
      <td className="px-4 py-2 font-medium text-gray-700">{label}</td>
      <td className="px-4 py-2 text-gray-600">{value || "N/A"}</td>
    </tr>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading sample data...
      </div>
    );
  }

  if (!sample) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-gray-500 mb-4">No sample found.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const lat = sample.latitude || -8.65;
  const lng = sample.longitude || 115.2167;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`h-screen bg-white shadow-xl transition-all duration-300 fixed ${
          sidebarOpen ? "w-56" : "w-16"
        } flex flex-col items-start`}
      >
        <div className="flex items-center space-x-2 p-4">
          <ChevronRight
            className={`transition-transform duration-300 ${
              sidebarOpen ? "rotate-90" : ""
            }`}
          />
          {sidebarOpen && (
            <h1 className="text-lg font-bold text-gray-700">MEROBase</h1>
          )}
        </div>

        <nav className="flex flex-col mt-4 w-full">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 rounded-lg"
          >
            <LayoutDashboard className="text-blue-600" />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => navigate("/addsample")}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-green-50 rounded-lg"
          >
            <PlusCircle className="text-green-600" />
            {sidebarOpen && <span>Add Sample</span>}
          </button>

          <button
            onClick={() => navigate("/editsample")}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-yellow-50 rounded-lg"
          >
            <Edit3 className="text-yellow-600" />
            {sidebarOpen && <span>Edit Sample</span>}
          </button>

          <button
            onClick={() => navigate("/searchsample")}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-purple-50 rounded-lg"
          >
            <Search className="text-purple-600" />
            {sidebarOpen && <span>Search Sample</span>}
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-16 md:ml-64 p-8 max-w-4xl mx-auto mt-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Sample Details
        </h1>

        {/* Edit button */}
        <div className="mb-6 text-right">
          <button
            onClick={() => navigate(`/editform/${sample.sampleID}`, { state: { sample } })}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Edit Sample
          </button>
        </div>

        {/* BASIC INFO */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <button
            onClick={() => toggle("basic")}
            className="w-full text-left text-xl font-semibold mb-4 text-gray-700"
          >
            Basic Information {open.basic ? "▲" : "▼"}
          </button>
          {open.basic && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Sample ID:</strong> {sample.sampleID}</p>
              <p><strong>Sample Type:</strong> {sample.sampleType}</p>
              <p><strong>Name:</strong> {sample.sampleName || "N/A"}</p>
              <p><strong>Species:</strong> {sample.species}</p>
              <p><strong>Genus:</strong> {sample.genus || "N/A"}</p>
              <p><strong>Family:</strong> {sample.family || "N/A"}</p>
              <p><strong>Kingdom:</strong> {sample.kingdom}</p>
              <p><strong>Project Type:</strong> {sample.projectType}</p>
              <p><strong>Collector:</strong> {sample.collectorName}</p>
              <p><strong>Collection Date:</strong> {sample.collectionDate ? new Date(sample.collectionDate).toLocaleDateString() : "N/A"}</p>
              <p><strong>Storage Location:</strong> {sample.storageLocation}</p>
              <p><strong>Coordinates:</strong> {lat}, {lng}</p>
            </div>
          )}
        </div>

        {/* MAP */}
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Sample Location</h2>
        <MapContainer
          center={[lat, lng]}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-72 rounded-lg shadow mb-10"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]}>
            <Popup>
              <strong>{sample.species}</strong>
              <br />
              {sample.projectType}
            </Popup>
          </Marker>
        </MapContainer>

        {/* MAIN PHOTO */}
        {sample.samplePhoto && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Main Sample Photo
            </h2>
            <img
              src={sample.samplePhoto}
              alt="Sample"
              className="w-full h-72 object-cover rounded-lg shadow"
            />
          </div>
        )}

        {/* MORPHOLOGY */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <button
            onClick={() => toggle("morphology")}
            className="w-full text-left text-xl font-semibold mb-4 text-gray-700"
          >
            Morphology Documentation {open.morphology ? "▲" : "▼"}
          </button>

          {open.morphology && (
            <>
              <h3 className="text-lg font-medium mb-2">SEM Photos</h3>
              {sample.morphology?.semPhotos?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {sample.morphology.semPhotos.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      className="w-full h-64 object-cover rounded-lg shadow"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic mb-6">No SEM photos available.</p>
              )}

              <h3 className="text-lg font-medium mb-2">Microscope Photos</h3>
              {sample.morphology?.microscopePhotos?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sample.morphology.microscopePhotos.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      className="w-full h-64 object-cover rounded-lg shadow"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No microscope photos available.</p>
              )}
            </>
          )}
        </div>

        {/* MICROBIOLOGY */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <button
            onClick={() => toggle("microbiology")}
            className="w-full text-left text-xl font-semibold mb-4 text-gray-700"
          >
            Microbiology Documentation {open.microbiology ? "▲" : "▼"}
          </button>

          {open.microbiology && (
            <>
              <h3 className="text-lg font-medium mb-2">Petri Dish Photos</h3>
              {sample.microbiology?.petriDishPhotos?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {sample.microbiology.petriDishPhotos.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      className="w-full h-64 object-cover rounded-lg shadow"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic mb-3">No petri dish photos available.</p>
              )}

              {/* ISOLATED DESCRIPTION */}
              <TableCard title="Isolated Description">
                <table className="w-full text-left">
                  <tbody>
                    {renderRow("Colony Shape", sample.microbiology?.isolatedDescription?.colonyShape)}
                    {renderRow("Margin", sample.microbiology?.isolatedDescription?.margin)}
                    {renderRow("Elevation", sample.microbiology?.isolatedDescription?.elevation)}
                    {renderRow("Color", sample.microbiology?.isolatedDescription?.color)}
                    {renderRow("Texture", sample.microbiology?.isolatedDescription?.texture)}
                    {renderRow("Microscopic Shape", sample.microbiology?.isolatedDescription?.microscopicShape)}
                    {renderRow("Arrangement", sample.microbiology?.isolatedDescription?.arrangement)}
                  </tbody>
                </table>
              </TableCard>

              {/* ISOLATED PROFILE */}
              <TableCard title="Isolated Profile">
                <table className="w-full text-left">
                  <tbody>
                    {renderRow("Gram Reaction", sample.microbiology?.isolatedProfile?.gramReaction)}
                    {renderRow("Motility", sample.microbiology?.isolatedProfile?.motility)}
                    {renderRow("Oxygen Requirement", sample.microbiology?.isolatedProfile?.oxygenRequirement)}
                    {renderRow("Halotolerance", sample.microbiology?.isolatedProfile?.halotolerance)}
                    {renderRow("Temperature Preference", sample.microbiology?.isolatedProfile?.temperaturePreference)}
                    {renderRow("Growth Media", sample.microbiology?.isolatedProfile?.growthMedia)}
                  </tbody>
                </table>
              </TableCard>

              {/* BIOCHEMICAL TESTS */}
              <TableCard title="Biochemical Tests">
                <table className="w-full text-left">
                  <tbody>
                    {Object.entries(sample.microbiology?.isolatedProfile?.biochemicalTests || {}).map(
                      ([testName, result]) => (
                        <tr key={testName} className="border-b">
                          <td className="px-4 py-2 font-medium text-gray-700">{testName}</td>
                          <td className="px-4 py-2 text-gray-600">{result ? "Positive" : "Negative"}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </TableCard>

              <h3 className="text-lg font-medium mt-4 mb-2">Gram Staining</h3>
              {sample.microbiology?.gramStainingPhoto ? (
                <img
                  src={sample.microbiology.gramStainingPhoto}
                  className="w-full h-64 object-cover rounded-lg shadow"
                />
              ) : (
                <p className="text-gray-500 italic">No gram staining photo available.</p>
              )}
            </>
          )}
        </div>

        {/* MOLECULAR */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <button
            onClick={() => toggle("molecular")}
            className="w-full text-left text-xl font-semibold mb-4 text-gray-700"
          >
            Molecular Documentation {open.molecular ? "▲" : "▼"}
          </button>

          {open.molecular && (
            <>
              <TableCard title="Molecular Summary">
                <table className="w-full text-left">
                  <tbody>
                    {renderRow("Marker Gene", sample.molecular?.markerGene)}
                    {renderRow("Primer Set", sample.molecular?.primerSet)}
                    {renderRow("PCR Conditions", sample.molecular?.pcrConditions)}
                    {renderRow("Sequencing Platform", sample.molecular?.sequencingPlatform)}
                  </tbody>
                </table>
              </TableCard>

              {sample.molecular?.gelPhoto && (
                <TableCard title="Gel Electrophoresis">
                  <img
                    src={sample.molecular.gelPhoto}
                    className="w-full h-64 object-cover rounded-lg shadow"
                  />
                </TableCard>
              )}

              {sample.molecular?.phyloTreePhoto && (
                <TableCard title="Phylogenetic Tree">
                  <img
                    src={sample.molecular.phyloTreePhoto}
                    className="w-full h-64 object-cover rounded-lg shadow mb-4"
                  />
                  <p className="text-gray-700">
                    {sample.molecular?.phyloTreeDescription || "No description"}
                  </p>
                </TableCard>
              )}
            </>
          )}
        </div>

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
