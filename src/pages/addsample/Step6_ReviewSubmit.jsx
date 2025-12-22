// src/pages/Step6_ReviewSubmit.jsx
import React, { useState } from "react";
import axios from "axios";
import { useSampleForm } from "../../context/SampleFormContext";
import FormProgressBar from "../../components/FormProgressBar";

export default function Step6_ReviewSubmit() {
  const { formData, clearDraft, uploadToCloudinaryBase64 } = useSampleForm();
  const [uploading, setUploading] = useState(false);

  const handleFinish = async () => {
    try {
      setUploading(true);

      const uploaded = {
        samplePhoto: null,
        morphology: { semPhotos: [], microPhotos: [] },
        microbiology: { images: {} },
        molecular: { gelImage: null, rawSequenceFiles: [] },
      };

      // ================= Metadata =================
      if (formData.metadata.samplePhoto) {
        uploaded.samplePhoto = await uploadToCloudinaryBase64(
          formData.metadata.samplePhoto.data,
          formData.metadata.samplePhoto.name
        );
      }

      // ================= Morphology =================
      if (formData.morphology.semPhotos?.length) {
        uploaded.morphology.semPhotos = await Promise.all(
          formData.morphology.semPhotos.map((f) =>
            uploadToCloudinaryBase64(f.data, f.name)
          )
        );
      }

      if (formData.morphology.microPhotos?.length) {
        uploaded.morphology.microPhotos = await Promise.all(
          formData.morphology.microPhotos.map((f) =>
            uploadToCloudinaryBase64(f.data, f.name)
          )
        );
      }

      // ================= Microbiology =================
      const microImages = formData.microbiology.images || {};
      for (const key of ["isolated", "macroscopic", "microscopic"]) {
        if (microImages[key]) {
          uploaded.microbiology.images[key] = await uploadToCloudinaryBase64(
            microImages[key].data,
            microImages[key].name
          );
        }
      }

      // ================= Molecular =================
      if (formData.molecular.gelImage) {
        uploaded.molecular.gelImage = await uploadToCloudinaryBase64(
          formData.molecular.gelImage.data,
          formData.molecular.gelImage.name
        );
      }
      if (formData.molecular.rawSequenceFiles?.length) {
        uploaded.molecular.rawSequenceFiles = await Promise.all(
          formData.molecular.rawSequenceFiles.map((f) =>
            uploadToCloudinaryBase64(f.data, f.name)
          )
        );
      }

      const payload = {
        metadata: { ...formData.metadata, samplePhoto: uploaded.samplePhoto },
        morphology: { ...formData.morphology, ...uploaded.morphology },
        microbiology: { ...formData.microbiology, ...uploaded.microbiology },
        molecular: { ...formData.molecular, ...uploaded.molecular },
        publication: formData.publication,
      };

      const res = await axios.post(
        import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/samples`
          : "http://localhost:5000/api/samples",
        payload
      );

      clearDraft();
      alert(`Sample created! ID: ${res.data.sampleID || res.data._id || "—"}`);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Submission failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  const safeRenderObject = (obj) => {
    if (!obj) return "—";
    return Object.entries(obj).map(([k, v]) => (
      <li key={k}>
        <strong>{k}:</strong> {typeof v === "object" ? JSON.stringify(v) : v || "—"}
      </li>
    ));
  };

  return (
    <div className="p-4">
      <FormProgressBar step={6} steps={6} />
      <h3 className="font-semibold mb-4 text-lg">Review & Submit</h3>

      <div className="space-y-6">

        {/* ================= Metadata ================= */}
        <div className="border p-4 rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Metadata</h4>
          <p><strong>Sample Name:</strong> {formData.metadata?.sampleName || "—"}</p>
          <p><strong>Project:</strong> {formData.metadata?.projectType || "—"}</p>
          <p><strong>Dive Site:</strong> {formData.metadata?.diveSite || "—"}</p>
          <p><strong>Species:</strong> {formData.metadata?.species || "—"}</p>
          {formData.metadata?.samplePhoto && (
            <img
              src={formData.metadata.samplePhoto.preview || formData.metadata.samplePhoto.data}
              className="mt-2 w-40 h-28 object-cover rounded"
            />
          )}
        </div>

        {/* ================= Morphology ================= */}
        <div className="border p-4 rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Morphology</h4>
          <p><strong>Notes:</strong> {formData.morphology?.notes || "—"}</p>
          <div className="flex gap-4 flex-wrap mt-2">
            {formData.morphology?.semPhotos?.map((p, i) => (
              <img key={`sem-${i}`} src={p.preview || p.data} className="w-32 h-32 object-cover rounded" />
            ))}
            {formData.morphology?.microPhotos?.map((p, i) => (
              <img key={`micro-${i}`} src={p.preview || p.data} className="w-32 h-32 object-cover rounded" />
            ))}
          </div>
        </div>

        {/* ================= Microbiology ================= */}
        <div className="border p-4 rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Microbiology</h4>
          <p><strong>Box ID:</strong> {formData.microbiology?.storageBox?.boxID || "—"}</p>
          <p><strong>Shelf:</strong> {formData.microbiology?.storageBox?.shelf || "—"}</p>
          <p><strong>Position:</strong> {formData.microbiology?.storageBox?.position || "—"}</p>
          <p><strong>Temperature:</strong> {formData.microbiology?.storageBox?.temperature || "—"}</p>
          <p><strong>Notes:</strong> {formData.microbiology?.storageBox?.notes || "—"}</p>

          <div className="flex gap-4 flex-wrap mt-2">
            {["isolated", "macroscopic", "microscopic"].map((key) =>
              formData.microbiology?.images?.[key] && (
                <div key={key}>
                  <p className="text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)} Image:</p>
                  <img
                    src={formData.microbiology.images[key].preview || formData.microbiology.images[key].data}
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )
            )}
          </div>

          {formData.microbiology?.isolatedDescription && (
            <div className="mt-3">
              <p><strong>Isolated Description:</strong></p>
              <ul className="list-disc list-inside">
                {safeRenderObject(formData.microbiology.isolatedDescription)}
              </ul>
            </div>
          )}

          {formData.microbiology?.macroscopicMorphology && (
            <p className="mt-2">
              <strong>Macroscopic Morphology:</strong>{" "}
              {JSON.stringify(formData.microbiology.macroscopicMorphology)}
            </p>
          )}
          {formData.microbiology?.microscopicMorphology && (
            <p>
              <strong>Microscopic Morphology:</strong>{" "}
              {JSON.stringify(formData.microbiology.microscopicMorphology)}
            </p>
          )}

          {formData.microbiology?.isolatedProfile && (
            <div className="mt-2">
              <p><strong>Isolated Profile:</strong></p>
              <ul className="list-disc list-inside">
                {safeRenderObject(formData.microbiology.isolatedProfile)}
              </ul>
            </div>
          )}

          {formData.microbiology?.antibacterialAssay && (
            <div className="mt-2">
              <p><strong>Antibacterial Assay:</strong></p>
              <ul className="list-disc list-inside">
                {safeRenderObject(formData.microbiology.antibacterialAssay)}
              </ul>
            </div>
          )}

          {formData.microbiology?.biochemicalTests?.length > 0 && (
            <p className="mt-2">
              <strong>Biochemical Tests:</strong>{" "}
              {formData.microbiology.biochemicalTests.join(", ")}
            </p>
          )}
          {formData.microbiology?.testNotes && (
            <p><strong>Test Notes:</strong> {formData.microbiology.testNotes}</p>
          )}
        </div>

        {/* ================= Molecular ================= */}
        <div className="border p-4 rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Molecular</h4>
          {formData.molecular &&
            Object.entries(formData.molecular).map(([k, v]) => {
              if (k === "gelImage" && v) return (
                <div key={k}>
                  <p><strong>Gel Image:</strong></p>
                  <img src={v.preview || v.data || v} className="w-32 h-32 object-cover rounded mt-2" />
                </div>
              );
              if (k === "rawSequenceFiles" && v?.length > 0) return (
                <p key={k}><strong>RAW Sequence Files:</strong> {v.map(f => f.name || JSON.stringify(f)).join(", ")}</p>
              );
              if (typeof v === "string" && v) return <p key={k}><strong>{k.replace(/([A-Z])/g, ' $1')}:</strong> {v}</p>;
              return null;
            })}
        </div>

      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => (window.location.href = "/add/step5")}
          className="px-4 py-2 border rounded"
        >
          Back
        </button>

        <button
          onClick={handleFinish}
          disabled={uploading}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {uploading ? "Submitting..." : "Finish & Submit"}
        </button>
      </div>
    </div>
  );
}
