import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Edit3,
  Search,
  ChevronRight
} from "lucide-react";

/* ================= COMPONENT ================= */

export default function SampleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sample, setSample] = useState(null);
  const [open, setOpen] = useState({
    metadata: true,
    morphology: true,
    microbiology: true,
    molecular: true
  });

  const toggle = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ================= LOAD SAMPLE ================= */

  useEffect(() => {
    try {
      const stored =
        JSON.parse(localStorage.getItem("merobase_samples")) || [];

      const found = stored.find(
        (s) => s?.metadata?.sampleId === id
      );

      setSample(found || null);
    } catch {
      setSample(null);
    }
  }, [id]);

  if (!sample) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Sample not found.
      </div>
    );
  }

  const m = sample.metadata;

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* ================= SIDEBAR ================= */}
      <aside
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`bg-white shadow-xl transition-all duration-300
        ${sidebarOpen ? "w-56" : "w-16"} flex flex-col`}
      >
        <div className="flex items-center gap-2 p-4">
          <ChevronRight
            className={`transition-transform ${
              sidebarOpen ? "rotate-90" : ""
            }`}
          />
          {sidebarOpen && (
            <h1 className="text-lg font-bold text-gray-700">
              MEROBase
            </h1>
          )}
        </div>

        <nav className="flex flex-col mt-4 gap-1">
          <SidebarBtn
            icon={<LayoutDashboard className="text-blue-600" />}
            label="Dashboard"
            open={sidebarOpen}
            onClick={() => navigate("/dashboard")}
          />
          <SidebarBtn
            icon={<PlusCircle className="text-green-600" />}
            label="Add Sample"
            open={sidebarOpen}
            onClick={() => navigate("/addsample")}
          />
          <SidebarBtn
            icon={<Edit3 className="text-yellow-600" />}
            label="Edit Sample"
            open={sidebarOpen}
            onClick={() => navigate("/editsample")}
          />
          <SidebarBtn
            icon={<Search className="text-purple-600" />}
            label="Search Sample"
            open={sidebarOpen}
            onClick={() => navigate("/searchsample")}
          />
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Sample Details
            </h1>
            <p className="text-sm text-gray-500">
              {m.sampleId}
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/addsample", {
                state: { mode: "edit", sample }
              })
            }
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Edit Sample
          </button>
        </div>

        {/* ================= METADATA ================= */}
        <Section
          title="Basic Information"
          open={open.metadata}
          onToggle={() => toggle("metadata")}
        >
          <InfoGrid>
            <Info label="Sample Name" value={m.sampleName} />
            <Info label="Sample Type" value={m.sampleType} />
            <Info label="Species" value={m.species} />
            <Info label="Genus" value={m.genus} />
            <Info label="Family" value={m.family} />
            <Info label="Kingdom" value={m.kingdom} />
            <Info label="Project Type" value={m.projectType} />
            <Info
              label="Collection Date"
              value={
                m.collectionDate
                  ? new Date(m.collectionDate).toLocaleDateString()
                  : "-"
              }
            />
            <Info label="Collector" value={m.collectorName} />
            <Info label="Storage Location" value={m.storageLocation} />
          </InfoGrid>
        </Section>

        {/* ================= MORPHOLOGY ================= */}
        <Section
          title="Morphology"
          open={open.morphology}
          onToggle={() => toggle("morphology")}
        >
          <ImageGrid images={sample.morphology?.semPhotos} />
        </Section>

        {/* ================= MICROBIOLOGY ================= */}
        <Section
          title="Microbiology"
          open={open.microbiology}
          onToggle={() => toggle("microbiology")}
        >
          <ImageGrid images={sample.microbiology?.petriDishPhotos} />
        </Section>

        {/* ================= MOLECULAR ================= */}
        <Section
          title="Molecular"
          open={open.molecular}
          onToggle={() => toggle("molecular")}
        >
          <InfoGrid>
            <Info
              label="Marker Gene"
              value={sample.molecular?.markerGene}
            />
            <Info
              label="Sequencing Method"
              value={sample.molecular?.sequencingMethod}
            />
            <Info
              label="Accession Number"
              value={sample.molecular?.accessionNumber}
            />
          </InfoGrid>
        </Section>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </main>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function SidebarBtn({ icon, label, open, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
    >
      {icon}
      {open && <span className="font-medium">{label}</span>}
    </button>
  );
}

function Section({ title, open, onToggle, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <button
        onClick={onToggle}
        className="w-full text-left text-lg font-semibold mb-4"
      >
        {title} {open ? "▲" : "▼"}
      </button>
      {open && children}
    </div>
  );
}

function InfoGrid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <p className="text-sm text-gray-700">
      <span className="font-semibold">{label}:</span>{" "}
      {value || "-"}
    </p>
  );
}

function ImageGrid({ images = [] }) {
  if (!images || images.length === 0) {
    return <p className="text-gray-500 italic">No images available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="w-full h-64 object-cover rounded-lg shadow"
        />
      ))}
    </div>
  );
}
