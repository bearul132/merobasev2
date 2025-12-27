// src/pages/addsample/Step1_Metadata.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import FormProgressBar from "../../components/FormProgressBar";
import { useSampleForm } from "../../context/SampleFormContext";

export default function Step1_Metadata() {
  const navigate = useNavigate();
  const { formData, updateSection } = useSampleForm();
  const metadata = formData.metadata;

  const [preview, setPreview] = useState(
    metadata.samplePhoto?.preview || null
  );

  const tulambenSites = [
    "USAT Liberty",
    "Tulamben Drop Off",
    "Kubu Wall",
    "Pyramids",
    "Batu Kelebit",
  ];

  const substrateOptions = ["Sand", "Rock", "Coral", "Mud", "Other"];
  const kingdoms = ["Undecided", "Animalia", "Plantae", "Fungi", "Other"];
  const storageOptions = [
    "Cool Room",
    "Freezer",
    "Refrigerator",
    "Room Temperature",
  ];

  const handleChange = (field, value) => {
    updateSection("metadata", { [field]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateSection("metadata", {
        samplePhoto: {
          name: file.name,
          data: reader.result,
          preview: reader.result,
        },
      });
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const LocationMarker = () => {
    const [position, setPosition] = useState(
      metadata.latitude && metadata.longitude
        ? [metadata.latitude, metadata.longitude]
        : null
    );

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        handleChange("latitude", lat);
        handleChange("longitude", lng);
      },
    });

    return position ? <Marker position={position} /> : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <FormProgressBar step={1} steps={6} />

        {/* ================= HEADER ================= */}
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Step 1 — Metadata
          </h2>
          <p className="text-sm text-gray-500">
            Basic sample information and location
          </p>
        </div>

        {/* ================= SAMPLE PHOTO ================= */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Sample Photo</h3>
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-blue-400 transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {!preview ? (
              <span className="text-gray-400">
                Drag & drop or click to upload
              </span>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg shadow"
              />
            )}
          </label>
        </div>

        {/* ================= GENERAL METADATA ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Sample Type">
            <select
              value={metadata.sampleType}
              onChange={(e) =>
                handleChange("sampleType", e.target.value)
              }
              className="input"
            >
              <option value="Biological">Biological</option>
              <option value="Non-Biological">Non-Biological</option>
            </select>
          </Field>

          <Field label="Sample Name">
            <input
              className="input"
              value={metadata.sampleName}
              onChange={(e) => handleChange("sampleName", e.target.value)}
            />
          </Field>

          <Field label="Sample Number">
            <input
              className="input"
              value={metadata.sampleNumber}
              onChange={(e) =>
                handleChange("sampleNumber", e.target.value)
              }
            />
          </Field>

          <Field label="Sample Length (cm)">
            <input
              type="number"
              className="input"
              value={metadata.sampleLength || ""}
              onChange={(e) =>
                handleChange("sampleLength", e.target.value)
              }
            />
          </Field>

          <Field label="Dive Site">
            <select
              className="input"
              value={metadata.diveSite}
              onChange={(e) => handleChange("diveSite", e.target.value)}
            >
              <option value="">Select site</option>
              {tulambenSites.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Depth (m)">
            <input
              type="number"
              className="input"
              value={metadata.depth || ""}
              onChange={(e) => handleChange("depth", e.target.value)}
            />
          </Field>

          <Field label="Temperature (°C)">
            <input
              type="number"
              className="input"
              value={metadata.temperature || ""}
              onChange={(e) =>
                handleChange("temperature", e.target.value)
              }
            />
          </Field>

          <Field label="Substrate">
            <select
              className="input"
              value={metadata.substrate || ""}
              onChange={(e) =>
                handleChange("substrate", e.target.value)
              }
            >
              <option value="">Select substrate</option>
              {substrateOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Project Type">
            <select
              className="input"
              value={metadata.projectType}
              onChange={(e) =>
                handleChange("projectType", e.target.value)
              }
            >
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </Field>

          <Field label="Project Number">
            <input
              className="input"
              value={metadata.projectNumber}
              onChange={(e) =>
                handleChange("projectNumber", e.target.value)
              }
            />
          </Field>

          <Field label="Collector Name">
            <input
              className="input"
              value={metadata.collectorName}
              onChange={(e) =>
                handleChange("collectorName", e.target.value)
              }
            />
          </Field>
        </div>

        {/* ================= BIO / NON-BIO ================= */}
        <div className="border-t pt-6">
          {metadata.sampleType === "Biological" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Kingdom">
                <select
                  className="input"
                  value={metadata.kingdom}
                  onChange={(e) =>
                    handleChange("kingdom", e.target.value)
                  }
                >
                  {kingdoms.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Genus">
                <input
                  className="input"
                  value={metadata.genus}
                  onChange={(e) =>
                    handleChange("genus", e.target.value)
                  }
                />
              </Field>

              <Field label="Family">
                <input
                  className="input"
                  value={metadata.family}
                  onChange={(e) =>
                    handleChange("family", e.target.value)
                  }
                />
              </Field>

              <Field label="Species">
                <input
                  className="input"
                  value={metadata.species}
                  onChange={(e) =>
                    handleChange("species", e.target.value)
                  }
                />
              </Field>

              <Field label="Storage Location" full>
                <select
                  className="input"
                  value={metadata.storageLocation}
                  onChange={(e) =>
                    handleChange("storageLocation", e.target.value)
                  }
                >
                  {storageOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          ) : (
            <Field label="Storage Location">
              <select
                className="input"
                value={metadata.storageLocation}
                onChange={(e) =>
                  handleChange("storageLocation", e.target.value)
                }
              >
                {storageOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        {/* ================= MAP ================= */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Map Location Picker</h3>
          <div className="h-64 rounded-xl overflow-hidden shadow">
            <MapContainer
              center={[-8.342, 115.544]}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Latitude">
              <input className="input" value={metadata.latitude || ""} readOnly />
            </Field>
            <Field label="Longitude">
              <input
                className="input"
                value={metadata.longitude || ""}
                readOnly
              />
            </Field>
          </div>
        </div>

        {/* ================= NAV ================= */}
        <div className="flex justify-between pt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate("/add/step2")}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE FIELD ================= */
function Field({ label, children, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}