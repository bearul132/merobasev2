// src/pages/addsample/Step2_Morphology.jsx
import { useState } from "react";

export default function Step2_Morphology({ wizardData = {}, setWizardData = () => {} }) {
  const morphology = wizardData.morphology || {};

  const [localData, setLocalData] = useState({
    semPhotos: morphology.semPhotos || [],
    microPhotos: morphology.microPhotos || [],
    notes: morphology.notes || "",
  });

  const handleChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    setWizardData(prev => ({
      ...prev,
      morphology: { ...prev.morphology, [field]: value },
    }));
  };

  const handleFileChange = (field, e) => {
    const files = Array.from(e.target.files).map(file => URL.createObjectURL(file));
    handleChange(field, [...localData[field], ...files]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
          Step 2: Morphology
        </h2>

        {/* SEM Photos */}
        <div className="flex flex-col items-center space-y-2">
          <label className="text-gray-700 font-medium">SEM Photos</label>
          <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange("semPhotos", e)}
              className="hidden"
              id="semPhotos"
            />
            <label htmlFor="semPhotos" className="cursor-pointer text-gray-500">
              Drag & drop or click to upload SEM photos
            </label>
            {localData.semPhotos.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {localData.semPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`SEM ${idx + 1}`}
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Microscopic Photos */}
        <div className="flex flex-col items-center space-y-2">
          <label className="text-gray-700 font-medium">Microscopic Photos</label>
          <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange("microPhotos", e)}
              className="hidden"
              id="microPhotos"
            />
            <label htmlFor="microPhotos" className="cursor-pointer text-gray-500">
              Drag & drop or click to upload microscopic photos
            </label>
            {localData.microPhotos.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {localData.microPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Micro ${idx + 1}`}
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block font-medium text-gray-600 mb-1">Notes</label>
          <textarea
            value={localData.notes}
            onChange={e => handleChange("notes", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter any notes related to morphology..."
          />
        </div>
      </div>
    </div>
  );
}
