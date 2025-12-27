import React from "react";
import { useNavigate } from "react-router-dom";
import { useSampleForm } from "../../context/SampleFormContext";
import FormProgressBar from "../../components/FormProgressBar";

export default function Step2_Morphology() {
  const navigate = useNavigate();
  const { formData, updateSection } = useSampleForm();
  const morphology = formData.morphology;

  /* ================= FILE HANDLERS ================= */
  const handleMultipleImages = (field, files) => {
    const mapped = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    updateSection("morphology", {
      [field]: [...(morphology[field] || []), ...mapped],
    });
  };

  const handleSingleImage = (field, file) => {
    if (!file) return;
    updateSection("morphology", {
      [field]: {
        file,
        preview: URL.createObjectURL(file),
      },
    });
  };

  const handleChange = (field, value) => {
    updateSection("morphology", { [field]: value });
  };

  /* ================= UI ================= */
  return (
    <div className="p-6">
      <FormProgressBar step={2} steps={6} />

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-10">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
          Step 2 — Morphology
        </h2>

        {/* ================= SEM PHOTOS ================= */}
        <section>
          <h3 className="font-semibold text-lg mb-3">SEM Photos</h3>
          <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition">
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={(e) => handleMultipleImages("semPhotos", e.target.files)}
            />
            <p className="text-gray-500">
              Drag & drop or click to upload SEM images
            </p>
          </label>

          {morphology.semPhotos?.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {morphology.semPhotos.map((img, i) => (
                <img
                  key={i}
                  src={img.preview}
                  alt={`SEM-${i}`}
                  className="w-full h-32 object-cover rounded-lg shadow"
                />
              ))}
            </div>
          )}
        </section>

        {/* ================= MICROSCOPE PHOTOS ================= */}
        <section>
          <h3 className="font-semibold text-lg mb-3">Microscopic Photos</h3>
          <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-green-400 transition">
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={(e) =>
                handleMultipleImages("microscopePhotos", e.target.files)
              }
            />
            <p className="text-gray-500">
              Drag & drop or click to upload microscopic images
            </p>
          </label>

          {morphology.microscopePhotos?.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {morphology.microscopePhotos.map((img, i) => (
                <img
                  key={i}
                  src={img.preview}
                  alt={`Micro-${i}`}
                  className="w-full h-32 object-cover rounded-lg shadow"
                />
              ))}
            </div>
          )}
        </section>

        {/* ================= PETRI & GRAM ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Petri Dish */}
          <div>
            <h3 className="font-semibold mb-2">Petri Dish Photo</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSingleImage("petriPhoto", e.target.files[0])}
              className="w-full border rounded-lg px-3 py-2"
            />
            {morphology.petriPhoto?.preview && (
              <img
                src={morphology.petriPhoto.preview}
                className="mt-3 w-full h-48 object-cover rounded-lg shadow"
              />
            )}
          </div>

          {/* Gram Staining */}
          <div>
            <h3 className="font-semibold mb-2">Gram Staining Photo</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSingleImage("gramPhoto", e.target.files[0])}
              className="w-full border rounded-lg px-3 py-2"
            />
            {morphology.gramPhoto?.preview && (
              <img
                src={morphology.gramPhoto.preview}
                className="mt-3 w-full h-48 object-cover rounded-lg shadow"
              />
            )}
          </div>
        </section>

        {/* ================= NOTES ================= */}
        <section>
          <h3 className="font-semibold mb-2">Morphology Notes</h3>
          <textarea
            value={morphology.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            placeholder="Describe morphology observations, structure, textures, etc."
          />
        </section>

        {/* ================= NAVIGATION ================= */}
        <div className="flex justify-between pt-6">
          <button
            onClick={() => navigate("/add/step1")}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Back
          </button>

          <button
            onClick={() => navigate("/add/step3")}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
