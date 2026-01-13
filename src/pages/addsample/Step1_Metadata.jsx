import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import FormProgressBar from "../../components/FormProgressBar";
import { useSampleForm } from "../../context/SampleFormContext";

/* ================= DROPDOWN DATA ================= */

const DIVE_SITES = [
  "USAT Liberty – Tulamben",
  "Tulamben Drop Off",
  "Coral Garden – Tulamben",
  "Kubu Wall",
  "Batu Kelebit",
  "Secret Bay – Gilimanuk",
  "Pemuteran Reef",
  "Menjangan Island",
  "Other",
];

const SUBSTRATES = [
  "Live Coral",
  "Dead Coral",
  "Rubble",
  "Sand",
  "Mud",
  "Rock",
  "Seagrass",
  "Artificial Structure",
  "Other",
];

const KINGDOMS = [
  "Animalia",
  "Plantae",
  "Fungi",
  "Protista",
  "Bacteria",
  "Archaea",
  "Undetermined",
];

const STORAGE_LOCATIONS = [
  "Cool Room (4°C)",
  "Refrigerator (4°C)",
  "Freezer (-20°C)",
  "Ultra Freezer (-80°C)",
  "Room Temperature",
  "Ethanol Preserved",
  "Formalin Preserved",
];

/* ================= MAIN ================= */

export default function Step1_Metadata() {
  const navigate = useNavigate();
  const { formData, updateSection } = useSampleForm();
  const metadata = formData.metadata;

  /* ================= COLLAPSE ================= */
  const [open, setOpen] = useState({
    photo: true,
    general: true,
    bio: true,
    molecular: false,
    map: true,
  });

  const toggle = (k) => setOpen((p) => ({ ...p, [k]: !p[k] }));

  /* ================= HELPERS ================= */
  const setValue = (field, value) =>
    updateSection("metadata", { [field]: value });

  const handleImage = (field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setValue(field, {
        name: file.name,
        data: reader.result,
        preview: reader.result,
      });
    reader.readAsDataURL(file);
  };

  const handleFile = (field, file) => {
    if (!file) return;
    setValue(field, {
      name: file.name,
      size: file.size,
      type: file.type,
    });
  };

  /* ================= MAP ================= */
  function LocationMarker() {
    const [pos, setPos] = useState(
      metadata.latitude && metadata.longitude
        ? [metadata.latitude, metadata.longitude]
        : null
    );

    useEffect(() => {
      if (metadata.latitude && metadata.longitude) {
        setPos([metadata.latitude, metadata.longitude]);
      }
    }, [metadata.latitude, metadata.longitude]);

    useMapEvents({
      click(e) {
        setPos([e.latlng.lat, e.latlng.lng]);
        setValue("latitude", e.latlng.lat);
        setValue("longitude", e.latlng.lng);
      },
    });

    return pos ? <Marker position={pos} /> : null;
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <FormProgressBar step={1} steps={6} />

        {/* ================= TITLE ================= */}
        <header className="border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Base Sample Metadata
          </h1>
          <p className="text-sm text-gray-500">
            Core information describing the collected sample
          </p>
        </header>

        {/* ================= SAMPLE PHOTO ================= */}
        <Box
          title="Sample Photo"
          open={open.photo}
          toggle={() => toggle("photo")}
        >
          <Dropzone
            label="Drag & drop or click to upload sample photo"
            preview={metadata.samplePhoto?.preview}
            onFile={(f) => handleImage("samplePhoto", f)}
          />
        </Box>

        {/* ================= GENERAL ================= */}
        <Box
          title="General Sample Information"
          open={open.general}
          toggle={() => toggle("general")}
        >
          <Grid>
            <Select label="Sample Type" value={metadata.sampleType}
              onChange={(v) => setValue("sampleType", v)}
              options={["Biological", "Non-Biological"]} />

            <Input label="Sample Name" value={metadata.sampleName}
              onChange={(v) => setValue("sampleName", v)} />

            <Input label="Sample Number" value={metadata.sampleNumber}
              onChange={(v) => setValue("sampleNumber", v)} />

            <Input label="Sample Length (cm)" type="number"
              value={metadata.sampleLength || ""}
              onChange={(v) => setValue("sampleLength", v)} />

            <Select label="Dive Site" value={metadata.diveSite || ""}
              onChange={(v) => setValue("diveSite", v)}
              options={DIVE_SITES} />

            <Input label="Depth (m)" type="number"
              value={metadata.depth || ""}
              onChange={(v) => setValue("depth", v)} />

            <Input label="Temperature (°C)" type="number"
              value={metadata.temperature || ""}
              onChange={(v) => setValue("temperature", v)} />

            <Select label="Substrate" value={metadata.substrate || ""}
              onChange={(v) => setValue("substrate", v)}
              options={SUBSTRATES} />

            <Select label="Project Type" value={metadata.projectType}
              onChange={(v) => setValue("projectType", v)}
              options={["A", "B"]} />

            <Input label="Project Number" value={metadata.projectNumber}
              onChange={(v) => setValue("projectNumber", v)} />

            <Input label="Date Acquired" type="date"
              value={metadata.dateAcquired || ""}
              onChange={(v) => setValue("dateAcquired", v)} />

            <Input label="Collector Name" value={metadata.collectorName}
              onChange={(v) => setValue("collectorName", v)} />
          </Grid>
        </Box>

        {/* ================= BIO / NON BIO ================= */}
        <Box
          title="Biological Classification & Storage"
          open={open.bio}
          toggle={() => toggle("bio")}
        >
          {metadata.sampleType === "Biological" ? (
            <Grid>
              <Select label="Kingdom" value={metadata.kingdom || ""}
                onChange={(v) => setValue("kingdom", v)}
                options={KINGDOMS} />

              <Input label="Genus" value={metadata.genus}
                onChange={(v) => setValue("genus", v)} />

              <Input label="Family" value={metadata.family}
                onChange={(v) => setValue("family", v)} />

              <Input label="Species" value={metadata.species}
                onChange={(v) => setValue("species", v)} />

              <Select label="Storage Location" full
                value={metadata.storageLocation || ""}
                onChange={(v) => setValue("storageLocation", v)}
                options={STORAGE_LOCATIONS} />
            </Grid>
          ) : (
            <Select label="Storage Location"
              value={metadata.storageLocation || ""}
              onChange={(v) => setValue("storageLocation", v)}
              options={STORAGE_LOCATIONS} />
          )}
        </Box>
        
        {/* ================= MAP ================= */}
        <Box
          title="Map Location Picker"
          open={open.map}
          toggle={() => toggle("map")}
        >
          <div className="h-64 rounded-xl overflow-hidden shadow mb-4">
            <MapContainer
              center={[-8.34, 115.54]}
              zoom={12}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
          </div>

          <Grid>
            <Input label="Latitude" value={metadata.latitude || ""}
              onChange={(v) => setValue("latitude", v)} />
            <Input label="Longitude" value={metadata.longitude || ""}
              onChange={(v) => setValue("longitude", v)} />
          </Grid>
        </Box>

        {/* ================= NAV ================= */}
        <div className="flex justify-between pt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate("/add/step2")}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE UI ================= */

function Box({ title, open, toggle, children }) {
  return (
    <section className="border rounded-xl shadow-sm">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center px-6 py-4 bg-gray-100 rounded-t-xl"
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="p-6">{children}</div>}
    </section>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-base"
      />
    </div>
  );
}

function Select({ label, value, onChange, options, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-base"
      >
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Dropzone({ label, preview, onFile }) {
  return (
    <div
      className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-400"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onFile(e.dataTransfer.files[0]);
      }}
    >
      <input type="file" hidden />
      {!preview ? (
        <p className="text-sm text-gray-400">{label}</p>
      ) : (
        <img src={preview} className="mx-auto h-48 object-cover rounded-lg" />
      )}
    </div>
  );
}

function FileDrop({ label, file, onFile }) {
  return (
    <div
      className="border-2 border-dashed rounded-xl p-6 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onFile(e.dataTransfer.files[0]);
      }}
    >
      <p className="text-sm text-gray-500">
        {file ? file.name : label}
      </p>
    </div>
  );
}
