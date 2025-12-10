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
        molecular: { seqFiles: [] }
      };

      // Upload sample photo
      if (formData.metadata.samplePhoto) {
        uploaded.samplePhoto = await uploadToCloudinaryBase64(
          formData.metadata.samplePhoto.data,
          formData.metadata.samplePhoto.name
        );
      }

      // Morphology photos
      if (formData.morphology.semPhotos?.length) {
        uploaded.morphology.semPhotos = await Promise.all(
          formData.morphology.semPhotos.map(f => uploadToCloudinaryBase64(f.data, f.name))
        );
      }
      if (formData.morphology.microPhotos?.length) {
        uploaded.morphology.microPhotos = await Promise.all(
          formData.morphology.microPhotos.map(f => uploadToCloudinaryBase64(f.data, f.name))
        );
      }

      // Microbiology images
      if (formData.microbiology.images?.isolated) {
        uploaded.microbiology.images.isolated = await uploadToCloudinaryBase64(
          formData.microbiology.images.isolated.data,
          formData.microbiology.images.isolated.name
        );
      }
      if (formData.microbiology.images?.microscopic) {
        uploaded.microbiology.images.microscopic = await uploadToCloudinaryBase64(
          formData.microbiology.images.microscopic.data,
          formData.microbiology.images.microscopic.name
        );
      }

      // Molecular sequences
      if (formData.molecular.seqFiles?.length) {
        uploaded.molecular.seqFiles = await Promise.all(
          formData.molecular.seqFiles.map(f => uploadToCloudinaryBase64(f.data, f.name))
        );
      }

      const payload = {
        metadata: { ...formData.metadata, samplePhoto: uploaded.samplePhoto },
        morphology: { ...formData.morphology, ...uploaded.morphology },
        microbiology: { ...formData.microbiology, ...uploaded.microbiology },
        molecular: { ...formData.molecular, ...uploaded.molecular },
        publication: formData.publication
      };

      const res = await axios.post(
        import.meta.env.VITE_API_URL
          ? import.meta.env.VITE_API_URL + "/api/samples"
          : "http://localhost:5000/api/samples",
        payload
      );

      clearDraft();
      alert("Sample created! ID: " + (res.data.sampleID || res.data._id || "—"));
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Submission failed. See console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <FormProgressBar step={6} steps={6} />
      <h3 className="font-semibold mb-4 text-lg">Review & Submit</h3>

      <div className="space-y-6">

        {/* =================== Metadata =================== */}
        <div className="border p-4 rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Metadata</h4>
          <p><strong>Sample Name:</strong> {formData.metadata.sampleName}</p>
          <p><strong>Project:</strong> {formData.metadata.projectType} - {formData.metadata.projectNumber}</p>
          <p><strong>Dive Site:</strong> {formData.metadata.diveSite}</p>
          <p><strong>Species:</strong> {formData.metadata.species}</p>
          {formData.metadata.samplePhoto && (
            <img src={formData.metadata.samplePhoto.preview || formData.metadata.samplePhoto.data} className="mt-2 w-40 h-28 object-cover rounded" />
          )}
        </div>

        {/* =================== Morphology =================== */}
        <div className="border p-4 rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Morphology</h4>
          <p><strong>Notes:</strong> {formData.morphology.notes}</p>

          <div className="flex gap-4 flex-wrap mt-2">
            {formData.morphology.semPhotos?.map((p, idx) => (
              <img key={idx} src={p.preview || p.data} alt={`SEM ${idx+1}`} className="w-32 h-32 object-cover rounded" />
            ))}
            {formData.morphology.microPhotos?.map((p, idx) => (
              <img key={idx} src={p.preview || p.data} alt={`Micro ${idx+1}`} className="w-32 h-32 object-cover rounded" />
            ))}
          </div>
        </div>

        {/* =================== Microbiology =================== */}
        <div className="border p-4 rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Microbiology</h4>

          {/* Storage Box */}
          <p><strong>Storage Box:</strong> {formData.microbiology.storageBox?.boxID}</p>
          <p><strong>Shelf:</strong> {formData.microbiology.storageBox?.shelf}</p>
          <p><strong>Position:</strong> {formData.microbiology.storageBox?.position}</p>
          <p><strong>Temperature:</strong> {formData.microbiology.storageBox?.temperature}</p>
          <p><strong>Notes:</strong> {formData.microbiology.storageBox?.notes}</p>

          {/* Isolated Description */}
          {formData.microbiology.isolatedDescription && (
            <div className="mt-2">
              <strong>Isolated Description:</strong>
              <ul className="list-disc ml-5">
                {Object.entries(formData.microbiology.isolatedDescription).map(([k,v]) => (
                  <li key={k}><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Isolated Profile */}
          {formData.microbiology.isolatedProfile && (
            <div className="mt-2">
              <strong>Isolated Profile:</strong>
              <ul className="list-disc ml-5">
                {Object.entries(formData.microbiology.isolatedProfile).map(([k,v]) => (
                  <li key={k}><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Biochemical Tests */}
          {formData.microbiology.biochemicalTests?.length > 0 && (
            <p><strong>Biochemical Tests:</strong> {formData.microbiology.biochemicalTests.join(', ')}</p>
          )}

          {/* Microbiology images */}
          <div className="flex gap-4 flex-wrap mt-2">
            {formData.microbiology.images?.isolated && (
              <img src={formData.microbiology.images.isolated.preview || formData.microbiology.images.isolated.data} className="w-32 h-32 object-cover rounded" />
            )}
            {formData.microbiology.images?.microscopic && (
              <img src={formData.microbiology.images.microscopic.preview || formData.microbiology.images.microscopic.data} className="w-32 h-32 object-cover rounded" />
            )}
          </div>
        </div>

        {/* =================== Molecular =================== */}
        <div className="border p-4 rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Molecular</h4>

          <p><strong>Extraction Method:</strong> {formData.molecular.extractionMethod}</p>
          <p><strong>Preservation:</strong> {formData.molecular.preservation}</p>
          <p><strong>Tissue Type:</strong> {formData.molecular.tissueType}</p>
          <p><strong>Extraction Kit:</strong> {formData.molecular.extractionKit}</p>
          <p><strong>Polymerase:</strong> {formData.molecular.polymerase}</p>
          <p><strong>Target Gene:</strong> {formData.molecular.targetGene}</p>
          <p><strong>PCR Additives:</strong> {formData.molecular.pcrAdditives}</p>
          <p><strong>Sequencing Platform:</strong> {formData.molecular.sequencingPlatform}</p>
          <p><strong>Library Prep:</strong> {formData.molecular.libraryPrep}</p>
          <p><strong>Read Type:</strong> {formData.molecular.readType}</p>
          <p><strong>Phylogenetic / Notes:</strong> {formData.molecular.phyloDescription}</p>

          {formData.molecular.gelPhoto && (
            <img src={formData.molecular.gelPhoto.preview || formData.molecular.gelPhoto.data} className="w-32 h-32 object-cover rounded mt-2" />
          )}
          {formData.molecular.seqFiles?.length > 0 && (
            <p className="mt-2"><strong>Sequence Files:</strong> {formData.molecular.seqFiles.map(f => f.name).join(', ')}</p>
          )}
        </div>

      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={() => (window.location.href = "/add/step5")}
          className="px-4 py-2 border rounded"
        >
          Back
        </button>
        <button
          type="button"
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
