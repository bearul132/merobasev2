// src/pages/addsample/Step6_ReviewSubmit.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSampleFormContext } from "../../context/SampleFormContext";

/* ================= PROGRESS BAR ================= */

const ProgressBar = ({ label, percent }) => (
  <div className="mb-5">
    <div className="flex justify-between text-sm font-medium mb-1">
      <span>{label}</span>
      <span>{percent}%</span>
    </div>

    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-300 ${
          percent === 100 ? "bg-green-500" : "bg-blue-600"
        }`}
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

/* ================= PROGRESS CALC ================= */

const calculateProgress = (section) => {
  if (!section || typeof section !== "object") return 0;

  const values = Object.values(section);
  if (values.length === 0) return 0;

  const filled = values.filter((v) => {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object" && v !== null)
      return Object.values(v).some((x) => x !== "" && x !== null);
    return v !== "" && v !== null;
  }).length;

  return Math.round((filled / values.length) * 100);
};

/* ================= COMPONENT ================= */

export default function Step6_ReviewSubmit() {
  const navigate = useNavigate();

  const {
    formData,
    mode,
    submitSampleToLocalStorage
  } = useSampleFormContext();

  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState(null); // success | error

  /* ===== Progress ===== */
  const progress = useMemo(
    () => ({
      metadata: calculateProgress(formData.metadata),
      morphology: calculateProgress(formData.morphology),
      microbiology: calculateProgress(formData.microbiology),
      molecular: calculateProgress(formData.molecular),
      publication: calculateProgress(formData.publication)
    }),
    [formData]
  );

  /* ===== Submit Handler ===== */
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      submitSampleToLocalStorage();

      setPopup({
        type: "success",
        message:
          mode === "edit"
            ? "Sample successfully updated"
            : "Sample successfully registered"
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Submit failed:", err);
      setPopup({
        type: "error",
        message: "Failed to save sample. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="relative max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-2 text-center">
        Review & Submit Sample
      </h2>

      <p className="text-sm text-gray-500 text-center mb-8">
        {mode === "edit"
          ? "You are updating an existing sample"
          : "You are registering a new sample"}{" "}
        — <strong>localStorage only</strong>
      </p>

      {/* Progress Overview */}
      <ProgressBar
        label="Metadata Completion"
        percent={progress.metadata}
      />
      <ProgressBar
        label="Morphology Completion"
        percent={progress.morphology}
      />
      <ProgressBar
        label="Microbiology Completion"
        percent={progress.microbiology}
      />
      <ProgressBar
        label="Molecular Completion"
        percent={progress.molecular}
      />
      <ProgressBar
        label="Publication Completion"
        percent={progress.publication}
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`mt-8 w-full py-3 rounded-xl text-white font-semibold transition ${
          submitting
            ? "bg-gray-400 cursor-not-allowed"
            : mode === "edit"
            ? "bg-amber-600 hover:bg-amber-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {submitting
          ? "Saving..."
          : mode === "edit"
          ? "Update Sample"
          : "Submit Sample"}
      </button>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Demo mode — data stored locally for presentation purposes
      </p>

      {/* ================= POPUP ================= */}
      {popup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg text-white ${
              popup.type === "success"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            <p className="font-semibold text-center">
              {popup.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
