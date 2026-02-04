// src/pages/addsample/Step2_Morphology.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormProgressBar from "../../components/FormProgressBar";
import { useSampleForm } from "../../context/SampleFormContext";

export default function Step2_Morphology() {
  const navigate = useNavigate();
  const { formData, updateSection } = useSampleForm();
  const morphology = formData.morphology || {};

  /* ================= COLLAPSE STATE ================= */
  const [open, setOpen] = useState({
    sem: true,
    microscope: true,
    notes: true,
  });

  const toggle = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ================= IMAGE RESIZING ================= */
  const resizeImage = (file) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1024;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) { h *= maxDim / w; w = maxDim; }
        if (h > w && h > maxDim) { w *= maxDim / h; h = maxDim; }
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

  const handleMultipleImages = async (field, files) => {
    const existingCount = morphology[field]?.length || 0;
    if (existingCount + files.length > 2) {
      alert("Maximum 2 images allowed for this section.");
      return;
    }

    const newFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        const data = await resizeImage(file);
        return {
          id: crypto.randomUUID(),
          name: file.name,
          data,
        };
      })
    );

    updateSection("morphology", {
      [field]: [...(morphology[field] || []), ...newFiles],
    });
  };

  const handleChange = (field, value) =>
    updateSection("morphology", { [field]: value });

  /* ================= UI ================= */
  return (
    <div className="min-h-screen p-6 font-sans bg-gray-50 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <FormProgressBar step={2} steps={6} />

        {/* ================= PAGE TITLE ================= */}
        <header className="border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Morphology
          </h1>
          <p className="text-sm text-gray-500">
            Upload SEM & Microscope images and add notes
          </p>
        </header>

        {/* ================= SEM PHOTOS ================= */}
        <Box
          title="SEM Photos"
          open={open.sem}
          toggle={() => toggle("sem")}
        >
          <FileUpload
            onFiles={(files) => handleMultipleImages("semPhotos", files)}
          />
          {morphology.semPhotos?.length > 0 && (
            <ImageGrid images={morphology.semPhotos} />
          )}
        </Box>

        {/* ================= MICROSCOPE PHOTOS ================= */}
        <Box
          title="Microscope Photos"
          open={open.microscope}
          toggle={() => toggle("microscope")}
        >
          <FileUpload
            onFiles={(files) =>
              handleMultipleImages("microscopePhotos", files)
            }
          />
          {morphology.microscopePhotos?.length > 0 && (
            <ImageGrid images={morphology.microscopePhotos} />
          )}
        </Box>

        {/* ================= NOTES ================= */}
        <Box title="Morphology Notes" open={open.notes} toggle={() => toggle("notes")}>
          <textarea
            value={morphology.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 text-base focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Describe morphology observations, structure, textures, size, or notable features"
          />
        </Box>

        {/* ================= NAVIGATION ================= */}
        <div className="flex justify-between pt-6">
          <button
            onClick={() => navigate("/add/step1")}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Back
          </button>
          <button
            onClick={() => navigate("/add/step3")}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */
function Box({ title, open, toggle, children }) {
  return (
    <section className="border rounded-xl">
      <button
        type="button"
        onClick={toggle}
        className="w-full flex justify-between items-center px-6 py-4 bg-gray-100 rounded-t-xl"
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="p-6 space-y-4">{children}</div>}
    </section>
  );
}

function FileUpload({ onFiles }) {
  return (
    <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition">
      <input
        type="file"
        multiple
        accept="image/*"
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />
      <p className="text-gray-500">Drag & drop or click to upload images</p>
    </label>
  );
}

function ImageGrid({ images }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {images.map((img) => (
        <img
          key={img.id}
          src={img.data}
          alt={img.name}
          className="w-full h-32 object-cover rounded-lg shadow"
        />
      ))}
    </div>
  );
}
