// src/pages/SampleDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Edit3,
  Search,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

/* ================= IMPORT TABS ================= */
import MetadataTab from "./SampleDetails/MetadataTab";
import MorphologyTab from "./SampleDetails/MorphologyTab";
import PrimaryIsolatedTab from "./SampleDetails/PrimaryIsolatedTab";
import IsolatedMorphologyTab from "./SampleDetails/IsolatedMorphologyTab";
import MiscTestsTab from "./SampleDetails/MiscTestsTab";
import MolecularTab from "./SampleDetails/MolecularTab";
import PublicationTab from "./SampleDetails/PublicationTab";

export default function SampleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sample, setSample] = useState(null);
  const [open, setOpen] = useState({
    metadata: true,
    morphology: false,
    primary: false,
    isolated: false,
    misc: false,
    molecular: false,
    publication: false,
  });

  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ================= LOAD SAMPLE ================= */
  useEffect(() => {
    try {
      const stored =
        JSON.parse(localStorage.getItem("merobase_samples")) || [];
      const found = stored.find((s) => s?.metadata?.sampleId === id);
      setSample(found || null);
    } catch {
      setSample(null);
    }
  }, [id]);

  if (!sample) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Sample not found.
      </div>
    );
  }

  /* ================= SIDEBAR BUTTON ================= */
  const SidebarBtn = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-100"
    >
      {icon}
      {sidebarOpen && <span>{label}</span>}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      <aside
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-60" : "w-16"
        }`}
      >
        <div className="flex items-center gap-2 p-4">
          <ChevronRight
            className={`transition-transform ${sidebarOpen ? "rotate-90" : ""}`}
          />
          {sidebarOpen && <h1 className="font-bold">MEROBase</h1>}
        </div>

        <nav className="flex flex-col gap-1 px-2">
          <SidebarBtn
            icon={<LayoutDashboard />}
            label="Dashboard"
            onClick={() => navigate("/dashboard")}
          />
          <SidebarBtn
            icon={<PlusCircle />}
            label="Add Sample"
            onClick={() => navigate("/addsample")}
          />
          <SidebarBtn
            icon={<Edit3 />}
            label="Edit Sample"
            onClick={() =>
              navigate("/addsample", { state: { mode: "edit", sample } })
            }
          />
          <SidebarBtn
            icon={<Search />}
            label="Search"
            onClick={() => navigate("/searchsample")}
          />
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 max-w-6xl mx-auto p-8 space-y-6">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">Sample Details</h1>
          <p className="text-sm text-gray-500">{sample.metadata?.sampleId}</p>
        </header>

        {/* ================= COLLAPSIBLE SECTIONS ================= */}
        <Section
          title="Metadata & Collection"
          open={open.metadata}
          onToggle={() => toggle("metadata")}
        >
          <MetadataTab metadata={sample.metadata} />
        </Section>

        <Section
          title="Morphology"
          open={open.morphology}
          onToggle={() => toggle("morphology")}
        >
          <MorphologyTab morphology={sample.morphology} />
        </Section>

        <Section
          title="Primary Isolated"
          open={open.primary}
          onToggle={() => toggle("primary")}
        >
          <PrimaryIsolatedTab primary={sample.microbiology.primaryIsolated} />
        </Section>

        <Section
          title="Isolated Morphology"
          open={open.isolated}
          onToggle={() => toggle("isolated")}
        >
          <IsolatedMorphologyTab
            isolated={sample.microbiology.isolatedMorphology}
          />
        </Section>

        <Section
          title="Miscellaneous Microbiology Tests"
          open={open.misc}
          onToggle={() => toggle("misc")}
        >
          <MiscTestsTab misc={sample.microbiology.microbiologyTests} />
        </Section>

        <Section
          title="Molecular Biology"
          open={open.molecular}
          onToggle={() => toggle("molecular")}
        >
          <MolecularTab molecular={sample.molecular} />
        </Section>

        <Section
          title="Publication / Links"
          open={open.publication}
          onToggle={() => toggle("publication")}
        >
          <PublicationTab publication={sample.publication} />
        </Section>
      </main>
    </div>
  );
}

/* ================= COLLAPSIBLE SECTION COMPONENT ================= */
function Section({ title, open, onToggle, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 mb-4 focus:outline-none"
      >
        <ChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
        <h2 className="text-lg font-semibold">{title}</h2>
      </button>
      {open && children}
    </div>
  );
}
