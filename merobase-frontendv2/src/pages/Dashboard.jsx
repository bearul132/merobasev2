import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from "recharts";
import "leaflet/dist/leaflet.css";

const kingdomColors = {
  Animalia: "#3B82F6",
  Plantae: "#10B981",
  Fungi: "#F59E0B",
  Other: "#EF4444",
};

export default function Dashboard({ samples }) {
  const navigate = useNavigate();

  if (!samples || samples.length === 0) {
    return (
      <div className="flex min-h-screen justify-center items-center font-sans">
        <p className="text-gray-500 text-lg">No samples available.</p>
      </div>
    );
  }

  // Aggregate data for charts
  const kingdomCounts = Object.entries(
    samples.reduce((acc, s) => ({ ...acc, [s.kingdom]: (acc[s.kingdom] || 0) + 1 }), {})
  ).map(([name, value]) => ({ name, value }));

  const projectCounts = Object.entries(
    samples.reduce((acc, s) => ({ ...acc, [s.projectType]: (acc[s.projectType] || 0) + 1 }), {})
  ).map(([name, value]) => ({ name, value }));

  const dateCounts = Object.entries(
    samples.reduce((acc, s) => ({ ...acc, [s.collectionDate]: (acc[s.collectionDate] || 0) + 1 }), {})
  ).map(([date, value]) => ({ date, value }));

  const latestRegistered = samples[samples.length - 1];
  const latestEdited = samples[0];

  return (
    <div className="flex min-h-screen font-sans bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-bold text-blue-600 mb-6">Control Panel</h2>
        <button
          onClick={() => navigate("/addsample")}
          className="mb-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add New Sample
        </button>
        <button
          onClick={() => navigate("/searchsample")}
          className="mb-4 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Search Sample
        </button>
        <button
          onClick={() => navigate("/editsample")}
          className="mb-4 w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Edit Sample
        </button>
        <button
          onClick={() => navigate("/")}
          className="mt-auto w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">MEROBase Dashboard</h1>

        {/* InfoCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[{ label: "Latest Registered", sample: latestRegistered }, { label: "Latest Edited", sample: latestEdited }].map(({ label, sample }, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">{label}</h3>
              <p className="text-gray-600 font-medium">{sample.species || "Unnamed Sample"}</p>
              <p className="text-gray-500 text-sm">Project: {sample.projectType}</p>
              <p className="text-gray-500 text-sm">Date Acquired: {sample.collectionDate}</p>
              <button
                onClick={() => navigate("/editsample", { state: { selectedSampleId: sample.id } })}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Sample Map (Bali)</h3>
          <MapContainer
            center={[-8.65, 115.2167]}
            zoom={10}
            scrollWheelZoom={true}
            className="w-full h-96 rounded-xl shadow"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {samples.map((s) => (
              <Marker key={s.id} position={[s.latitude, s.longitude]}>
                <Popup>
                  <strong>{s.species}</strong>
                  <br />
                  Project: {s.projectType}
                  <br />
                  Date: {s.collectionDate}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Kingdom Types</h3>
            <PieChart width={250} height={250}>
              <Pie data={kingdomCounts} dataKey="value" nameKey="name" outerRadius={80} label>
                {kingdomCounts.map((entry, index) => (
                  <Cell key={index} fill={kingdomColors[entry.name] || "#D1D5DB"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Project Types</h3>
            <BarChart width={250} height={250} data={projectCounts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Date Acquired</h3>
            <LineChart width={250} height={250} data={dateCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#10B981" />
            </LineChart>
          </div>
        </div>
      </main>
    </div>
  );
}
