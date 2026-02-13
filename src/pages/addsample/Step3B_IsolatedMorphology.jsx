// src/pages/addsample/Step3B_IsolatedMorphology.jsx
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSampleForm } from "../../context/SampleFormContext";

export default function Step3B_IsolatedMorphology() {
  const { formData, updateSection } = useSampleForm();
  const microbiology = formData.microbiology || {};
  const isolated = microbiology.isolatedMorphology || {};

  const [open, setOpen] = useState({
    macroscopic: true,
    colonyDescription: true,
    microscopic: true,
  });

  const toggle = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ================= IMAGE RESIZE & LIMIT ================= */
  const resizeImage = (file) =>
    new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        const maxDim = 1024;
        let w = img.width;
        let h = img.height;

        if (w > h && w > maxDim) {
          h *= maxDim / w;
          w = maxDim;
        }
        if (h > w && h > maxDim) {
          w *= maxDim / h;
          h = maxDim;
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (blob) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          },
          "image/jpeg",
          0.7
        );
      };
    });

  const handleFileDrop = async (section, field, files) => {
    const existingCount = isolated[section]?.[field]?.length || 0;
    if (existingCount + files.length > 2) {
      alert("Maximum 2 images allowed for this section.");
      return;
    }

    const normalized = await Promise.all(
      Array.from(files).map(resizeImage)
    );

    updateSection("microbiology", {
      ...microbiology,
      isolatedMorphology: {
        ...isolated,
        [section]: {
          ...isolated[section],
          [field]: [
            ...(isolated[section]?.[field] || []),
            ...normalized.map((data) => ({
              id: crypto.randomUUID(),
              data,
            })),
          ],
        },
      },
    });
  };

  const handleSelect = (section, field, value) => {
    updateSection("microbiology", {
      ...microbiology,
      isolatedMorphology: {
        ...isolated,
        [section]: {
          ...isolated[section],
          [field]: value,
        },
      },
    });
  };

  /* ================= OPTIONS ================= */
  const macroscopicShapes = ["Round", "Oval", "Irregular"];
  const macroscopicArrangements = ["Single", "Cluster", "Chains"];

  const colonyShapes = ["Circular", "Irregular", "Filamentous"];
  const colonyMargins = ["Entire", "Undulate", "Lobate"];
  const colonyElevations = ["Flat", "Raised", "Convex"];
  const colonyColors = ["White", "Cream", "Yellow", "Red"];
  const colonyTextures = ["Smooth", "Rough", "Mucoid"];
  const colonyMotilities = ["Motile", "Non-motile"];

  const microscopicShapes = ["Coccus", "Bacillus", "Spiral"];
  const microscopicArrangements = ["Single", "Pairs", "Chains"];
  const gramReactions = ["Positive", "Negative"];

  return (
    <div className="p-6 font-sans">
      <h1 className="text-[24px] font-bold text-gray-800 mb-4">
        Isolated Morphology
      </h1>

      {/* ================= MACROSCOPIC MORPHOLOGY ================= */}
      <CollapsibleBox
        title="Macroscopic Morphology"
        isOpen={open.macroscopic}
        onToggle={() => toggle("macroscopic")}
      >
        <FileUpload
          existing={isolated.macroscopic?.images || []}
          onFiles={(files) =>
            handleFileDrop("macroscopic", "images", files)
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <SelectInput
            label="Macroscopic Shape"
            value={isolated.macroscopic?.shape || ""}
            options={macroscopicShapes}
            onChange={(v) => handleSelect("macroscopic", "shape", v)}
          />
          <SelectInput
            label="Macroscopic Arrangement"
            value={isolated.macroscopic?.arrangement || ""}
            options={macroscopicArrangements}
            onChange={(v) =>
              handleSelect("macroscopic", "arrangement", v)
            }
          />
        </div>
      </CollapsibleBox>

      {/* ================= COLONY DESCRIPTION (NO IMAGES) ================= */}
      <CollapsibleBox
        title="Colony Description"
        isOpen={open.colonyDescription}
        onToggle={() => toggle("colonyDescription")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            label="Shape"
            value={isolated.colonyDescription?.shape || ""}
            options={colonyShapes}
            onChange={(v) =>
              handleSelect("colonyDescription", "shape", v)
            }
          />
          <SelectInput
            label="Margin"
            value={isolated.colonyDescription?.margin || ""}
            options={colonyMargins}
            onChange={(v) =>
              handleSelect("colonyDescription", "margin", v)
            }
          />
          <SelectInput
            label="Elevation"
            value={isolated.colonyDescription?.elevation || ""}
            options={colonyElevations}
            onChange={(v) =>
              handleSelect("colonyDescription", "elevation", v)
            }
          />
          <SelectInput
            label="Color"
            value={isolated.colonyDescription?.color || ""}
            options={colonyColors}
            onChange={(v) =>
              handleSelect("colonyDescription", "color", v)
            }
          />
          <SelectInput
            label="Texture"
            value={isolated.colonyDescription?.texture || ""}
            options={colonyTextures}
            onChange={(v) =>
              handleSelect("colonyDescription", "texture", v)
            }
          />
          <SelectInput
            label="Motility"
            value={isolated.colonyDescription?.motility || ""}
            options={colonyMotilities}
            onChange={(v) =>
              handleSelect("colonyDescription", "motility", v)
            }
          />
        </div>
      </CollapsibleBox>

      {/* ================= MICROSCOPIC MORPHOLOGY ================= */}
      <CollapsibleBox
        title="Microscopic Morphology"
        isOpen={open.microscopic}
        onToggle={() => toggle("microscopic")}
      >
        <FileUpload
          existing={isolated.microscopic?.images || []}
          onFiles={(files) =>
            handleFileDrop("microscopic", "images", files)
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <SelectInput
            label="Microscopic Shape"
            value={isolated.microscopic?.shape || ""}
            options={microscopicShapes}
            onChange={(v) =>
              handleSelect("microscopic", "shape", v)
            }
          />
          <SelectInput
            label="Microscopic Arrangement"
            value={isolated.microscopic?.arrangement || ""}
            options={microscopicArrangements}
            onChange={(v) =>
              handleSelect("microscopic", "arrangement", v)
            }
          />
          <SelectInput
            label="Gram Reaction"
            value={isolated.microscopic?.gramReaction || ""}
            options={gramReactions}
            onChange={(v) =>
              handleSelect("microscopic", "gramReaction", v)
            }
          />
        </div>
      </CollapsibleBox>
    </div>
  );
}

/* ================== REUSABLE COMPONENTS ================== */
function CollapsibleBox({ title, children, isOpen, onToggle }) {
  return (
    <div className="border rounded-2xl shadow-sm bg-white mb-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gray-50 hover:bg-gray-100 transition"
      >
        <h2 className="text-[18px] font-semibold text-gray-700">
          {title}
        </h2>
        <ChevronDown
          className={`transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="p-6 space-y-6">{children}</div>}
    </div>
  );
}

function SelectInput({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-[14px] font-medium text-gray-600 mb-1">
        {label}
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 p-2 text-[16px] bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileUpload({ existing = [], onFiles }) {
  return (
    <>
      <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition">
        <input
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={(e) => onFiles(e.target.files)}
        />
        <p className="text-gray-500">
          Drag & drop or click to upload images
        </p>
      </label>

      {existing.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {existing.map((img) => (
            <img
              key={img.id}
              src={img.data}
              alt="preview"
              className="w-full h-32 object-cover rounded-lg shadow"
            />
          ))}
        </div>
      )}
    </>
  );
}
